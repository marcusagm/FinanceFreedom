import { Test, TestingModule } from "@nestjs/testing";
import { InvestmentAccountService } from "./investment-account.service";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateInvestmentAccountDto } from "./dto/create-investment-account.dto";
import { UpdateInvestmentAccountDto } from "./dto/update-investment-account.dto";
import { NotFoundException } from "@nestjs/common";

const mockPrismaService = {
    investmentAccount: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
};

describe("InvestmentAccountService", () => {
    let service: InvestmentAccountService;
    let prisma: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                InvestmentAccountService,
                { provide: PrismaService, useValue: mockPrismaService },
            ],
        }).compile();

        service = module.get<InvestmentAccountService>(
            InvestmentAccountService
        );
        prisma = module.get<PrismaService>(PrismaService);
        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("create", () => {
        it("should create an investment account", async () => {
            const dto: CreateInvestmentAccountDto = {
                name: "My Investment",
                type: "FIXED_INCOME",
                balance: 1000,
                profitability: 12,
                profitabilityType: "CDI",
                maturityDate: new Date("2025-12-31"),
                description: "Test account",
            };

            const expectedResult = { id: "1", ...dto, userId: "user-1" };
            (prisma.investmentAccount.create as jest.Mock).mockResolvedValue(
                expectedResult
            );

            const result = await service.create("user-1", dto);

            expect(prisma.investmentAccount.create).toHaveBeenCalledWith({
                data: {
                    ...dto,
                    userId: "user-1",
                },
            });
            expect(result).toEqual(expectedResult);
        });
    });

    describe("findAll", () => {
        it("should return an array of investment accounts", async () => {
            const expectedResult = [
                { id: "1", name: "Invest 1", userId: "user-1" },
            ];
            (prisma.investmentAccount.findMany as jest.Mock).mockResolvedValue(
                expectedResult
            );

            const result = await service.findAll("user-1");

            expect(prisma.investmentAccount.findMany).toHaveBeenCalledWith({
                where: { userId: "user-1" },
                orderBy: { createdAt: "desc" },
            });
            expect(result).toEqual(expectedResult);
        });
    });

    describe("findOne", () => {
        it("should return a single investment account", async () => {
            const expectedResult = {
                id: "1",
                name: "Invest 1",
                userId: "user-1",
            };
            (prisma.investmentAccount.findFirst as jest.Mock).mockResolvedValue(
                expectedResult
            );

            const result = await service.findOne("user-1", "1");

            expect(prisma.investmentAccount.findFirst).toHaveBeenCalledWith({
                where: { id: "1", userId: "user-1" },
            });
            expect(result).toEqual(expectedResult);
        });

        it("should throw NotFoundException if not found", async () => {
            (prisma.investmentAccount.findFirst as jest.Mock).mockResolvedValue(
                null
            );
            await expect(service.findOne("user-1", "999")).rejects.toThrow(
                NotFoundException
            );
        });
    });

    describe("update", () => {
        it("should update an investment account", async () => {
            const dto: UpdateInvestmentAccountDto = { name: "Updated Name" };
            const existingAccount = {
                id: "1",
                userId: "user-1",
                name: "Old Name",
            };
            const expectedResult = { ...existingAccount, ...dto };

            (prisma.investmentAccount.findFirst as jest.Mock).mockResolvedValue(
                existingAccount
            );
            (prisma.investmentAccount.update as jest.Mock).mockResolvedValue(
                expectedResult
            );

            const result = await service.update("user-1", "1", dto);

            expect(prisma.investmentAccount.update).toHaveBeenCalledWith({
                where: { id: "1" },
                data: dto,
            });
            expect(result).toEqual(expectedResult);
        });
    });

    describe("remove", () => {
        it("should delete an investment account", async () => {
            const existingAccount = { id: "1", userId: "user-1" };
            (prisma.investmentAccount.findFirst as jest.Mock).mockResolvedValue(
                existingAccount
            );
            (prisma.investmentAccount.delete as jest.Mock).mockResolvedValue(
                existingAccount
            );

            await service.remove("user-1", "1");

            expect(prisma.investmentAccount.delete).toHaveBeenCalledWith({
                where: { id: "1" },
            });
        });
    });
});
