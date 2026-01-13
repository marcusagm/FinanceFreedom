import { Test, TestingModule } from "@nestjs/testing";
import { ImportService } from "./import.service";
import { ImapService } from "./imap.service";
import { OfxParserService } from "./ofx-parser.service";
import { SmartMergerService } from "./smart-merger.service";
import { TransactionService } from "../transaction/transaction.service";
import { PrismaService } from "../../prisma/prisma.service";

describe("ImportService", () => {
    let service: ImportService;
    let imapService: ImapService;
    let prisma: PrismaService;

    const mockImapService = {
        fetchUnseenAttachments: jest.fn(),
    };
    const mockOfxParser = {
        parse: jest.fn(),
    };
    const mockSmartMerger = {
        filterDuplicates: jest.fn(),
    };
    const mockTransactionService = {
        create: jest.fn(),
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    const mockPrisma = {
        emailCredential: {
            findMany: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ImportService,
                {
                    provide: ImapService,
                    useValue: mockImapService,
                },
                {
                    provide: OfxParserService,
                    useValue: mockOfxParser,
                },
                {
                    provide: SmartMergerService,
                    useValue: mockSmartMerger,
                },
                {
                    provide: TransactionService,
                    useValue: mockTransactionService,
                },
                { provide: PrismaService, useValue: mockPrisma },
            ],
        }).compile();

        service = module.get<ImportService>(ImportService);
        imapService = module.get<ImapService>(ImapService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("syncAllAccounts", () => {
        it("should iterate over all credentials and sync them", async () => {
            const credentials = [
                { accountId: "acc1", email: "test1@test.com" },
                { accountId: "acc2", email: "test2@test.com" },
            ];
            mockPrisma.emailCredential.findMany.mockResolvedValue(credentials);
            mockImapService.fetchUnseenAttachments.mockResolvedValue([]);

            const count = await service.syncAllAccounts();

            expect(mockPrisma.emailCredential.findMany).toHaveBeenCalled();
            expect(
                mockImapService.fetchUnseenAttachments
            ).toHaveBeenCalledTimes(2);
            expect(count).toBe(0);
        });

        it("should process attachments if found", async () => {
            const credentials = [
                { accountId: "acc1", email: "test1@test.com" },
            ];
            mockPrisma.emailCredential.findMany.mockResolvedValue(credentials);
            mockImapService.fetchUnseenAttachments.mockResolvedValue([
                Buffer.from("fake-ofx"),
            ]);
            mockOfxParser.parse.mockResolvedValue([{ id: "tx1", amount: 100 }]);
            mockSmartMerger.filterDuplicates.mockResolvedValue([
                { id: "tx1", amount: 100 },
            ]);

            const count = await service.syncAllAccounts();

            expect(mockOfxParser.parse).toHaveBeenCalled();
            expect(mockSmartMerger.filterDuplicates).toHaveBeenCalled();
            expect(mockTransactionService.create).toHaveBeenCalled();
            expect(count).toBe(1);
        });
    });
});
