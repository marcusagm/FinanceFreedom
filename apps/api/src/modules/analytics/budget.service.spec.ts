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
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("getBudgetStatus", () => {
        it("should return budget status for categories", async () => {
            const userId = "user-123";
            const categories = [
                { id: "cat1", name: "Food", color: "blue", budgetLimit: 1000 },
                {
                    id: "cat2",
                    name: "Transport",
                    color: "red",
                    budgetLimit: 500,
                },
            ];

            mockPrismaService.category.findMany.mockResolvedValue(categories);

            // Mock individual aggregate calls
            // First call for cat1 (Food) - Spent 800
            // Second call for cat2 (Transport) - Spent 600 (Over budget)
            mockPrismaService.transaction.aggregate
                .mockResolvedValueOnce({ _sum: { amount: 800 } })
                .mockResolvedValueOnce({ _sum: { amount: 600 } });

            const result = await service.getBudgetStatus(userId);

            expect(mockPrismaService.category.findMany).toHaveBeenCalledWith({
                where: {
                    userId,
                    budgetLimit: { gt: 0 },
                },
            });

            expect(result).toHaveLength(2);
            // Result is sorted by percentage descending
            expect(result[0].categoryName).toBe("Transport"); // 120% (capped at 100% calculation inside but sorted? logic check: min(100) used for percentage field)
            expect(result[0].percentage).toBe(100);
            expect(result[0].status).toBe("CRITICAL"); // >= 90
            expect(result[0].spent).toBe(600);

            expect(result[1].categoryName).toBe("Food"); // 80%
            expect(result[1].percentage).toBe(80);
            expect(result[1].status).toBe("WARNING"); // >= 75
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

            mockPrismaService.category.findMany.mockResolvedValue(categories);
            mockPrismaService.transaction.aggregate.mockResolvedValue({
                _sum: { amount: 5000 },
            });

            const result = await service.getIncomeDistribution(userId);

            expect(mockPrismaService.category.findMany).toHaveBeenCalledWith({
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
