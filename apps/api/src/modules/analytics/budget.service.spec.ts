import { Test, TestingModule } from "@nestjs/testing";
import { BudgetService } from "./budget.service";
import { PrismaService } from "../../prisma/prisma.service";

describe("BudgetService", () => {
    let service: BudgetService;
    let prisma: PrismaService;

    const mockPrismaService = {
        category: {
            findMany: jest.fn(),
        },
        transaction: {
            aggregate: jest.fn(),
        },
        budgetHistory: {
            findMany: jest.fn(),
            findFirst: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BudgetService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<BudgetService>(BudgetService);
        prisma = module.get<PrismaService>(PrismaService);
        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("getBudgetStatus", () => {
        it("should return budget status using history over default limit", async () => {
            const userId = "user-123";
            const categories = [
                { id: "cat1", name: "Food", color: "blue", budgetLimit: 1000 },
                {
                    id: "cat2",
                    name: "Transport",
                    color: "red",
                    budgetLimit: 500, // Default 500
                },
            ];

            // History overrides Transport to 800
            const history = [
                {
                    categoryId: "cat2",
                    amount: 800,
                    month: new Date().getMonth() + 1,
                    year: new Date().getFullYear(),
                },
            ];

            (prisma.category.findMany as any).mockResolvedValue(categories);
            (prisma.budgetHistory.findMany as any).mockResolvedValue(history);

            // Mock individual aggregate calls
            // First call for cat1 (Food) - Spent 500 (50%)
            // Second call for cat2 (Transport) - Spent 600 (75% of 800)
            (prisma.transaction.aggregate as any)
                .mockResolvedValueOnce({ _sum: { amount: 500 } })
                .mockResolvedValueOnce({ _sum: { amount: 600 } });

            const result = await service.getBudgetStatus(userId);

            expect(prisma.category.findMany).toHaveBeenCalled();
            expect(prisma.budgetHistory.findMany).toHaveBeenCalled();

            expect(result).toHaveLength(2);

            // Transport: Limit 800 (from history), Spent 600 -> 75% -> WARNING
            const transport = result.find(
                (r) => r.categoryName === "Transport",
            );
            expect(transport).toBeDefined();
            expect(transport?.limit).toBe(800);
            expect(transport?.spent).toBe(600);
            expect(transport?.status).toBe("WARNING");

            // Food: Limit 1000 (default), Spent 500 -> 50% -> NORMAL
            const food = result.find((r) => r.categoryName === "Food");
            expect(food).toBeDefined();
            expect(food?.limit).toBe(1000);
            expect(food?.spent).toBe(500);
            expect(food?.status).toBe("NORMAL");
        });
    });

    describe("upsertBudget", () => {
        it("should create new budget history if not exists", async () => {
            (prisma.budgetHistory.findFirst as any).mockResolvedValue(null);
            (prisma.budgetHistory.create as any).mockResolvedValue({ id: "1" });

            const userId = "user1";
            const categoryId = "cat1";
            const amount = 500;
            const date = new Date(2025, 0, 1); // Jan 2025

            await service.upsertBudget(userId, categoryId, amount, date);

            expect(prisma.budgetHistory.create).toHaveBeenCalledWith({
                data: {
                    userId,
                    categoryId,
                    amount,
                    month: 1,
                    year: 2025,
                },
            });
        });

        it("should update existing budget history", async () => {
            (prisma.budgetHistory.findFirst as any).mockResolvedValue({
                id: "hist1",
            });
            (prisma.budgetHistory.update as any).mockResolvedValue({
                id: "hist1",
            });

            const userId = "user1";
            const categoryId = "cat1";
            const amount = 600;
            const date = new Date();

            await service.upsertBudget(userId, categoryId, amount, date);

            expect(prisma.budgetHistory.update).toHaveBeenCalledWith({
                where: { id: "hist1" },
                data: { amount },
            });
        });
    });

    describe("getIncomeDistribution", () => {
        it("should return income distribution", async () => {
            const userId = "user-123";
            const categories = [
                {
                    id: "cat1",
                    name: "Salary",
                    color: "green",
                    budgetLimit: 5000,
                },
            ];

            (prisma.category.findMany as any).mockResolvedValue(categories);
            (prisma.transaction.aggregate as any).mockResolvedValue({
                _sum: { amount: 5000 },
            });

            const result = await service.getIncomeDistribution(userId);

            expect(prisma.category.findMany).toHaveBeenCalledWith({
                where: {
                    userId,
                    type: "INCOME",
                },
            });

            expect(result).toHaveLength(1);
            expect(result[0].received).toBe(5000);
            expect(result[0].percentage).toBe(100);
        });
    });
});
