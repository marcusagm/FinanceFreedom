import { Test, TestingModule } from "@nestjs/testing";
import { AnalyticsController } from "./analytics.controller";
import { BudgetService } from "./budget.service";
import { HealthScoreService } from "./health-score.service";

describe("AnalyticsController", () => {
    let controller: AnalyticsController;
    let budgetService: BudgetService;
    let healthScoreService: HealthScoreService;

    const mockBudgetService = {
        getBudgetStatus: jest.fn(),
        getIncomeDistribution: jest.fn(),
    };

    const mockHealthScoreService = {
        getLatestScore: jest.fn(),
        calculateScore: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AnalyticsController],
            providers: [
                {
                    provide: BudgetService,
                    useValue: mockBudgetService,
                },
                {
                    provide: HealthScoreService,
                    useValue: mockHealthScoreService,
                },
            ],
        }).compile();

        controller = module.get<AnalyticsController>(AnalyticsController);
        budgetService = module.get<BudgetService>(BudgetService);
        healthScoreService = module.get<HealthScoreService>(HealthScoreService);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("getBudgets", () => {
        it("should return budget status", async () => {
            const req = { user: { userId: "user-123" } };
            const result = [{ categoryName: "Food", percentage: 50 }];
            mockBudgetService.getBudgetStatus.mockResolvedValue(result);

            expect(await controller.getBudgets(req)).toBe(result);
            expect(mockBudgetService.getBudgetStatus).toHaveBeenCalledWith(
                "user-123"
            );
        });
    });

    describe("getHealthScore", () => {
        it("should return latest health score", async () => {
            const req = { user: { userId: "user-123" } };
            const result = { score: 85 };
            mockHealthScoreService.getLatestScore.mockResolvedValue(result);

            expect(await controller.getHealthScore(req)).toBe(result);
            expect(mockHealthScoreService.getLatestScore).toHaveBeenCalledWith(
                "user-123"
            );
        });
    });

    describe("calculateHealthScore", () => {
        it("should calculate and return health score", async () => {
            const req = { user: { userId: "user-123" } };
            const result = { score: 90 };
            mockHealthScoreService.calculateScore.mockResolvedValue(result);

            expect(await controller.calculateHealthScore(req)).toBe(result);
            expect(mockHealthScoreService.calculateScore).toHaveBeenCalledWith(
                "user-123"
            );
        });
    });

    describe("getIncomes", () => {
        it("should return income distribution", async () => {
            const req = { user: { userId: "user-123" } };
            const result = [{ categoryName: "Salary", received: 5000 }];
            mockBudgetService.getIncomeDistribution.mockResolvedValue(result);

            expect(await controller.getIncomes(req)).toBe(result);
            expect(
                mockBudgetService.getIncomeDistribution
            ).toHaveBeenCalledWith("user-123");
        });
    });
});
