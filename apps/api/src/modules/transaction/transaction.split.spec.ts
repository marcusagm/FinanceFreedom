import { Test, TestingModule } from "@nestjs/testing";
import { TransactionService } from "./transaction.service";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { SplitTransactionDto } from "./dto/split-transaction.dto";
import { BadRequestException } from "@nestjs/common";

const mockTransactionClient = {
    transaction: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
    account: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
    },
    debt: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
    },
};

const mockPrismaService = {
    $transaction: jest.fn((callback) => callback(mockTransactionClient)),
    transaction: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
    },
};

describe("TransactionService - Advanced Features", () => {
    let service: TransactionService;
    let prisma: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TransactionService,
                { provide: PrismaService, useValue: mockPrismaService },
            ],
        }).compile();

        service = module.get<TransactionService>(TransactionService);
        prisma = module.get<PrismaService>(PrismaService);

        jest.resetAllMocks();
        (prisma.$transaction as jest.Mock).mockImplementation((callback: any) =>
            callback(mockTransactionClient),
        );
    });

    describe("create (Recurring)", () => {
        it("should create multiple transactions when isRecurring is true", async () => {
            const dto: CreateTransactionDto = {
                accountId: "acc-1",
                amount: 100,
                type: "EXPENSE",
                date: "2023-01-01",
                description: "Rent",
                isRecurring: true,
                repeatCount: 3,
            };

            const mockAccount = { id: "acc-1", balance: 1000 };
            (
                mockTransactionClient.account.findFirst as jest.Mock
            ).mockResolvedValue(mockAccount);
            (
                mockTransactionClient.transaction.create as jest.Mock
            ).mockResolvedValue({
                id: "tx-1",
                ...dto,
            });

            await service.create("user-1", dto);

            // Should call create 3 times
            expect(
                mockTransactionClient.transaction.create,
            ).toHaveBeenCalledTimes(3);

            // Check dates
            const calls = (
                mockTransactionClient.transaction.create as jest.Mock
            ).mock.calls;
            expect(
                new Date(calls[0][0].data.date).toISOString().split("T")[0],
            ).toBe("2023-01-01");
            expect(
                new Date(calls[1][0].data.date).toISOString().split("T")[0],
            ).toBe("2023-02-01");
            expect(
                new Date(calls[2][0].data.date).toISOString().split("T")[0],
            ).toBe("2023-03-01");
        });
    });

    describe("split", () => {
        it("should split a transaction into multiple parts and delete the original", async () => {
            const originalTx = {
                id: "tx-original",
                amount: 100,
                type: "EXPENSE",
                accountId: "acc-1",
                date: new Date("2023-01-01"),
                description: "Supermarket",
                category: "General",
            };

            const splitDto: SplitTransactionDto = {
                splits: [
                    { amount: 40, description: "Food", category: "Groceries" },
                    { amount: 60, description: "Cleaning", category: "Home" },
                ],
            };

            (
                mockTransactionClient.transaction.findFirst as jest.Mock
            ).mockResolvedValue(originalTx);
            (
                mockTransactionClient.transaction.create as jest.Mock
            ).mockResolvedValue({
                id: "new-tx",
            });

            await service.split("user-1", "tx-original", splitDto);

            // 1. Check creation of new transactions
            expect(
                mockTransactionClient.transaction.create,
            ).toHaveBeenCalledTimes(2);
            expect(
                mockTransactionClient.transaction.create,
            ).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    amount: 40,
                    description: "Food",
                }),
            });
            expect(
                mockTransactionClient.transaction.create,
            ).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    amount: 60,
                    description: "Cleaning",
                }),
            });

            // 2. Check deletion of original
            expect(
                mockTransactionClient.transaction.delete,
            ).toHaveBeenCalledWith({
                where: { id: "tx-original" },
            });
        });

        it("should throw error if splits sum does not match original amount", async () => {
            const originalTx = {
                id: "tx-original",
                amount: 100,
            };

            const splitDto: SplitTransactionDto = {
                splits: [
                    { amount: 40, description: "Food" },
                    { amount: 50, description: "Cleaning" }, // Sum = 90
                ],
            };

            (
                mockTransactionClient.transaction.findFirst as jest.Mock
            ).mockResolvedValue(originalTx);

            await expect(
                service.split("user-1", "tx-original", splitDto),
            ).rejects.toThrow(BadRequestException);
        });
    });
});
