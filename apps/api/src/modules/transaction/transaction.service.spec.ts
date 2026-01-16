import { Test, TestingModule } from "@nestjs/testing";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { TransactionService } from "./transaction.service";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateTransactionDto } from "./dto/create-transaction.dto";

const mockTransactionClient = {
    transaction: {
        create: vi.fn(),
        findMany: vi.fn(),
        findFirst: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
    },
    account: {
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
        findFirst: vi.fn(),
        count: vi.fn(),
    },
    debt: {
        findUnique: vi.fn(),
        update: vi.fn(),
    },
};

describe("TransactionService", () => {
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

    describe("create", () => {
        it("should create a transaction and update account balance (Income)", async () => {
            const dto: CreateTransactionDto = {
                accountId: "acc-1",
                amount: 100,
                type: "INCOME",
                date: "2023-01-01",
                description: "Salary",
            };

            const mockAccount = { id: "acc-1", balance: 50 };
            const expectedTransaction = { id: "tx-1", ...dto };

            mockTransactionClient.transaction.create.mockResolvedValue(
                expectedTransaction
            );
            mockTransactionClient.account.findFirst.mockResolvedValue(
                mockAccount
            );

            const result = await service.create("user-1", dto);

            expect(result).toEqual(expectedTransaction);
            expect(mockTransactionClient.transaction.create).toHaveBeenCalled();
            expect(mockTransactionClient.account.update).toHaveBeenCalledWith({
                where: { id: "acc-1" },
                data: { balance: 150 },
            });
        });

        it("should create a transaction and update account balance (Expense)", async () => {
            const dto: CreateTransactionDto = {
                accountId: "acc-1",
                amount: 50,
                type: "EXPENSE",
                date: "2023-01-01",
                description: "Food",
            };

            const mockAccount = { id: "acc-1", balance: 100 };
            const expectedTransaction = { id: "tx-1", ...dto };

            mockTransactionClient.transaction.create.mockResolvedValue(
                expectedTransaction
            );
            mockTransactionClient.account.findFirst.mockResolvedValue(
                mockAccount
            );

            await service.create("user-1", dto);

            expect(mockTransactionClient.account.update).toHaveBeenCalledWith({
                where: { id: "acc-1" },
                data: { balance: 50 },
            });
        });

        it("should create a transaction and update debt balance (Expense with Debt)", async () => {
            const dto: CreateTransactionDto = {
                accountId: "acc-1",
                amount: 50,
                type: "EXPENSE",
                date: "2023-01-01",
                description: "Debt Payment",
                debtId: "debt-1",
            };

            const mockAccount = { id: "acc-1", balance: 100 };
            const mockDebt = { id: "debt-1", totalAmount: 500 };
            const expectedTransaction = { id: "tx-1", ...dto };

            mockTransactionClient.transaction.create.mockResolvedValue(
                expectedTransaction
            );
            mockTransactionClient.account.findFirst.mockResolvedValue(
                mockAccount
            );
            // Mock debt find
            mockTransactionClient["debt"] = {
                findFirst: vi.fn().mockResolvedValue(mockDebt),
                update: vi.fn(),
            };

            await service.create("user-1", dto);

            expect(mockTransactionClient.account.update).toHaveBeenCalledWith({
                where: { id: "acc-1" },
                data: { balance: 50 },
            });

            expect(mockTransactionClient["debt"].update).toHaveBeenCalledWith({
                where: { id: "debt-1" },
                data: { totalAmount: 450, installmentsPaid: 0 },
            });
        });
    });

    describe("findAll", () => {
        it("should return an array of transactions", async () => {
            const result = [{ id: "1" }];
            (prisma.transaction.findMany as any).mockResolvedValue(result);
            (prisma.transaction.count as any).mockResolvedValue(1);
            const response = await service.findAll("user-1", {});
            expect(response.data).toBe(result);
        });

        it("should apply filters correctly", async () => {
            const result = [{ id: "1" }];
            (prisma.transaction.findMany as any).mockResolvedValue(result);
            (prisma.transaction.count as any).mockResolvedValue(1);

            const filters = {
                search: "test",
                accountId: "acc-1",
                categoryId: "cat-1",
                startDate: "2023-01-01",
                endDate: "2023-01-31",
            };

            await service.findAll("user-1", filters);

            expect(prisma.transaction.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        userId: "user-1",
                        description: { contains: "test" },
                        accountId: "acc-1",
                        categoryId: "cat-1",
                        date: {
                            gte: new Date("2023-01-01"),
                            lte: new Date("2023-01-31"),
                        },
                    }),
                })
            );
        });
    });

    describe("findOne", () => {
        it("should return a single transaction", async () => {
            const result = { id: "1" };
            (prisma.transaction.findFirst as any).mockResolvedValue(result);
            expect(await service.findOne("user-1", "1")).toBe(result);
        });
    });

    describe("update", () => {
        it("should update a transaction and recalculate balance (Amount change)", async () => {
            const id = "tx-1";
            const dto = {
                amount: 200,
                accountId: "acc-1",
                type: "INCOME",
            } as any;

            const oldTransaction = {
                id,
                amount: 100,
                type: "INCOME",
                accountId: "acc-1",
                account: { balance: 150 },
            };

            mockTransactionClient.transaction.findFirst
                .mockResolvedValueOnce(oldTransaction)
                .mockResolvedValueOnce({ ...oldTransaction, amount: 200 });

            mockTransactionClient.account.findFirst.mockResolvedValue({
                id: "acc-1",
                balance: 50,
            });

            mockTransactionClient.transaction.update = vi.fn();

            await service.update("user-1", id, dto);

            // Verify Revert
            expect(
                mockTransactionClient.account.update
            ).toHaveBeenNthCalledWith(1, {
                where: { id: "acc-1" },
                data: { balance: 50 },
            });

            // Verify Apply New
            expect(
                mockTransactionClient.account.update
            ).toHaveBeenNthCalledWith(2, {
                where: { id: "acc-1" },
                data: { balance: 250 },
            });
        });
    });

    describe("remove", () => {
        it("should delete transaction and revert balance", async () => {
            const id = "tx-1";
            const transaction = {
                id,
                amount: 100,
                type: "INCOME",
                accountId: "acc-1",
                account: { balance: 150 },
            };

            mockTransactionClient.transaction.findFirst.mockResolvedValue(
                transaction
            );

            await service.remove("user-1", id);

            expect(mockTransactionClient.account.update).toHaveBeenCalledWith({
                where: { id: "acc-1" },
                data: { balance: 50 },
            });

            expect(
                mockTransactionClient.transaction.delete
            ).toHaveBeenCalledWith({
                where: { id },
            });
        });
    });
});
