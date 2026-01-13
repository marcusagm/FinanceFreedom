import { Test, TestingModule } from "@nestjs/testing";
import { TransactionService } from "./transaction.service";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateTransactionDto } from "./dto/create-transaction.dto";

const mockTransactionClient = {
    transaction: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
    account: {
        findFirst: jest.fn(),
        update: jest.fn(),
    },
    debt: {
        findUnique: jest.fn(), // debt service might use findUnique?
        // Service code: prisma.debt.findFirst (in create)
        // Wait, line 74: `prisma.debt.findFirst`
        findFirst: jest.fn(),
        update: jest.fn(),
    },
};

const mockPrismaService = {
    $transaction: jest.fn((callback) => callback(mockTransactionClient)),
    transaction: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
    },
    debt: {
        findUnique: jest.fn(),
        update: jest.fn(),
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

        jest.resetAllMocks();
        (prisma.$transaction as jest.Mock).mockImplementation((callback) =>
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

            // Verify transaction creation
            expect(mockTransactionClient.transaction.create).toHaveBeenCalled();

            // Verify balance update logic
            // Initial 50 + 100 Income = 150
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

            // Initial 100 - 50 Expense = 50
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
                findFirst: jest.fn().mockResolvedValue(mockDebt),
                update: jest.fn(),
            };

            await service.create("user-1", dto);

            expect(mockTransactionClient.account.update).toHaveBeenCalledWith({
                where: { id: "acc-1" },
                data: { balance: 50 },
            });

            expect(mockTransactionClient["debt"].update).toHaveBeenCalledWith({
                where: { id: "debt-1" },
                data: { totalAmount: 450 }, // 500 - 50
            });
        });
    });

    describe("findAll", () => {
        it("should return an array of transactions", async () => {
            const result = [{ id: "1" }];
            (prisma.transaction.findMany as jest.Mock).mockResolvedValue(
                result
            );

            expect(await service.findAll("user-1")).toBe(result);
        });
    });

    describe("findOne", () => {
        it("should return a single transaction", async () => {
            const result = { id: "1" };
            (prisma.transaction.findFirst as jest.Mock).mockResolvedValue(
                result
            );

            expect(await service.findOne("user-1", "1")).toBe(result);
        });
    });

    describe("update", () => {
        it("should update a transaction and recalculate balance (Amount change)", async () => {
            // Setup: Old transaction was Income of 100. New is Income of 200.
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

            // 1. Get Old
            mockTransactionClient.transaction.findFirst
                .mockResolvedValueOnce(oldTransaction) // For step 1
                .mockResolvedValueOnce({ ...oldTransaction, amount: 200 }); // For return? (mock implementation might differ in reality but logic flow matters)

            // 2. Revert logic: Old Income 100 -> Revert means Balance - 100 = 50.
            // 3. New logic: New Income 200 -> Balance 50 + 200 = 250.

            // For findTargetAccount (Step 5)
            mockTransactionClient.account.findFirst.mockResolvedValue({
                id: "acc-1",
                balance: 50,
            }); // Balance after revert

            // Update call needs mockTransactionClient methods mocked
            mockTransactionClient.transaction.update = jest.fn();

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
                account: { balance: 150 }, // When fetched, balance includes the transaction effect
            };

            mockTransactionClient.transaction.findFirst.mockResolvedValue(
                transaction
            );

            await service.remove("user-1", id);

            // Logic in service:
            // balanceChange = 100 (Income)
            // newBalance = 150 - 100 = 50

            // newBalance = 150 - 100 = 50

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
