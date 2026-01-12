import { Test, TestingModule } from "@nestjs/testing";
import { ImportController } from "./import.controller";
import { OfxParserService } from "./ofx-parser.service";
import { SmartMergerService } from "./smart-merger.service";
import { TransactionService } from "../transaction/transaction.service";
import { ImapService } from "./imap.service";
import { PrismaService } from "../../prisma/prisma.service";
import { ImportService } from "./import.service";
import { BadRequestException } from "@nestjs/common";

describe("ImportController", () => {
    let controller: ImportController;
    let ofxParser: OfxParserService;
    let smartMerger: SmartMergerService;
    let transactionService: TransactionService;
    let imapService: ImapService;
    let prisma: PrismaService;

    const mockOfxParser = {
        parse: jest.fn(),
    };
    const mockSmartMerger = {
        filterDuplicates: jest.fn(),
    };
    const mockTransactionService = {
        create: jest.fn(),
    };
    const mockImapService = {
        fetchUnseenAttachments: jest.fn(),
        testConnection: jest.fn(),
    };
    const mockPrisma = {
        emailCredential: {
            findFirst: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
            delete: jest.fn(),
        },
    };

    const mockImportService = {
        syncAllAccounts: jest.fn(),
        syncAccount: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ImportController],
            providers: [
                { provide: OfxParserService, useValue: mockOfxParser },
                { provide: SmartMergerService, useValue: mockSmartMerger },
                {
                    provide: TransactionService,
                    useValue: mockTransactionService,
                },
                { provide: ImapService, useValue: mockImapService },
                { provide: PrismaService, useValue: mockPrisma },
                { provide: ImportService, useValue: mockImportService },
            ],
        }).compile();

        controller = module.get<ImportController>(ImportController);
        ofxParser = module.get<OfxParserService>(OfxParserService);
        smartMerger = module.get<SmartMergerService>(SmartMergerService);
        transactionService = module.get<TransactionService>(TransactionService);
        imapService = module.get<ImapService>(ImapService);
        prisma = module.get<PrismaService>(PrismaService);
        // importService = module.get<ImportService>(ImportService); // Optional if we need to spy on it

        jest.clearAllMocks();
    });

    describe("uploadFile", () => {
        it("should upload and parse file", async () => {
            const file = { buffer: Buffer.from("OFX CONTENT") };
            const accountId = "acc1";
            const transactions = [{ description: "T1" }];
            const uniqueTransactions = [{ description: "T1" }];

            mockOfxParser.parse.mockResolvedValue(transactions);
            mockSmartMerger.filterDuplicates.mockResolvedValue(
                uniqueTransactions
            );

            const result = await controller.uploadFile(file, accountId);

            expect(result).toEqual(uniqueTransactions);
            expect(ofxParser.parse).toHaveBeenCalledWith(file.buffer);
            expect(transactions[0]).toHaveProperty("accountId", accountId);
            expect(smartMerger.filterDuplicates).toHaveBeenCalledWith(
                accountId,
                transactions
            );
        });

        it("should throw error if file missing", async () => {
            await expect(controller.uploadFile(null, "acc1")).rejects.toThrow(
                BadRequestException
            );
        });

        it("should throw error if accountId missing", async () => {
            await expect(
                controller.uploadFile({ buffer: Buffer.from("") }, null as any)
            ).rejects.toThrow(BadRequestException);
        });
    });

    describe("confirmImport", () => {
        it("should confirm import of transactions", async () => {
            const body = [{ description: "T1" }] as any;
            mockTransactionService.create.mockResolvedValue({ id: "t1" });

            const result = await controller.confirmImport(body);

            expect(result.imported).toBe(1);
            expect(result.failed).toBe(0);
            expect(transactionService.create).toHaveBeenCalledWith(body[0]);
        });

        it("should handle creation errors", async () => {
            const body = [{ description: "T1" }] as any;
            mockTransactionService.create.mockRejectedValue(new Error("Fail"));

            const result = await controller.confirmImport(body);

            expect(result.imported).toBe(0);
            expect(result.failed).toBe(1);
            expect(result.errors[0].error).toBe("Fail");
        });
    });

    describe("getImapConfigs", () => {
        it("should return configs without passwords", async () => {
            const config = { id: "1", password: "encrypted" };
            (
                mockPrisma.emailCredential.findMany as jest.Mock
            ).mockResolvedValue([config]);

            const result = await controller.getImapConfigs("acc1");

            expect(result).toEqual([
                {
                    ...config,
                    password: "",
                    hasPassword: true,
                },
            ]);
        });

        it("should return empty array if no config", async () => {
            (
                mockPrisma.emailCredential.findMany as jest.Mock
            ).mockResolvedValue([]);
            const result = await controller.getImapConfigs("acc1");
            expect(result).toEqual([]);
        });

        it("should throw if no accountId", async () => {
            await expect(controller.getImapConfigs("")).rejects.toThrow(
                BadRequestException
            );
        });
    });

    describe("saveImapConfig", () => {
        it("should create new config", async () => {
            const body = {
                accountId: "acc1",
                host: "imap",
                email: "e",
                password: "p",
                port: 993,
            };
            (
                mockPrisma.emailCredential.findFirst as jest.Mock
            ).mockResolvedValue(null);
            (mockPrisma.emailCredential.create as jest.Mock).mockResolvedValue({
                id: "1",
            });

            await controller.saveImapConfig(body);

            expect(mockPrisma.emailCredential.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    accountId: "acc1",
                    password: "p",
                }),
            });
        });

        it("should update existing config", async () => {
            const body = {
                accountId: "acc1",
                host: "imap",
                email: "e",
                port: 993,
                id: "1",
            };
            const existing = { id: "1", password: "old" };
            (
                mockPrisma.emailCredential.findUnique as jest.Mock
            ).mockResolvedValue(existing);

            await controller.saveImapConfig(body);

            expect(mockPrisma.emailCredential.update).toHaveBeenCalledWith({
                where: { id: "1" },
                data: expect.objectContaining({ accountId: "acc1" }),
            });
        });
    });

    describe("testImapConfig", () => {
        it("should test connection with provided password", async () => {
            const body = { accountId: "acc1", password: "p" };
            mockImapService.testConnection.mockResolvedValue({ success: true });

            await controller.testImapConfig(body);

            expect(imapService.testConnection).toHaveBeenCalledWith(
                expect.objectContaining({ password: "p" })
            );
        });

        it("should use saved password if not provided", async () => {
            const body = { accountId: "acc1", id: "1" };
            (
                mockPrisma.emailCredential.findUnique as jest.Mock
            ).mockResolvedValue({ password: "saved" });
            mockImapService.testConnection.mockResolvedValue({ success: true });

            await controller.testImapConfig(body);

            expect(imapService.testConnection).toHaveBeenCalledWith(
                expect.objectContaining({ password: "saved" })
            );
        });
    });

    describe("syncNow", () => {
        it("should fetch and parse attachments", async () => {
            const buffer = Buffer.from("OFX");
            const transactions = [{ description: "T1" }];
            const unique = [{ description: "T1" }];

            (
                mockPrisma.emailCredential.findMany as jest.Mock
            ).mockResolvedValue([{ id: "1" }]);
            mockImportService.syncAccount.mockResolvedValue(1);

            const result = await controller.syncNow("acc1");

            expect(result.imported).toBe(1);
            expect(mockImportService.syncAccount).toHaveBeenCalled();
        });
    });
});
