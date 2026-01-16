import { Test, TestingModule } from "@nestjs/testing";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { TransactionService } from "./transaction.service";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { SplitTransactionDto } from "./dto/split-transaction.dto";
import { BadRequestException } from "@nestjs/common";

const mockTransactionClient = {
    transaction: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        findFirst: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
    },
    account: {
        findUnique: vi.fn(),
        findFirst: vi.fn(),
        update: vi.fn(),
    },
    debt: {
        findUnique: vi.fn(),
        findFirst: vi.fn(),
        update: vi.fn(),
    },
};

const mockPrismaService = {
    $transaction: vi.fn((callback) => callback(mockTransactionClient)),
    transaction: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
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

        vi.resetAllMocks();
        (prisma.$transaction as any).mockImplementation((callback: any) =>
            callback(mockTransactionClient)
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
            mockTransactionClient.account.findFirst.mockResolvedValue(
                mockAccount
            );
            mockTransactionClient.transaction.create.mockResolvedValue({
                id: "tx-1",
                ...dto,
            });

            await service.create("user-1", dto);

            // Should call create 3 times
            expect(
                mockTransactionClient.transaction.create
            ).toHaveBeenCalledTimes(3);

            // Check dates
            const calls = mockTransactionClient.transaction.create.mock.calls;
            expect(
                new Date(calls[0][0].data.date).toISOString().split("T")[0]
            ).toBe("2023-01-01");
            expect(
                new Date(calls[1][0].data.date).toISOString().split("T")[0]
            ).toBe("2023-02-01");
            expect(
                new Date(calls[2][0].data.date).toISOString().split("T")[0]
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

            mockTransactionClient.transaction.findFirst.mockResolvedValue(
                originalTx
            );
            mockTransactionClient.transaction.create.mockResolvedValue({
                id: "new-tx",
            });

            await service.split("user-1", "tx-original", splitDto);

            // 1. Check creation of new transactions
            expect(
                mockTransactionClient.transaction.create
            ).toHaveBeenCalledTimes(2);
            expect(
                mockTransactionClient.transaction.create
            ).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    amount: 40,
                    description: "Food",
                }),
            });
            expect(
                mockTransactionClient.transaction.create
            ).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    amount: 60,
                    description: "Cleaning",
                }),
            });

            // 2. Check deletion of original
            expect(
                mockTransactionClient.transaction.delete
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

            mockTransactionClient.transaction.findFirst.mockResolvedValue(
                originalTx
            );

            await expect(
                service.split("user-1", "tx-original", splitDto)
            ).rejects.toThrow(BadRequestException);
        });
    });
});
