import { Test, TestingModule } from "@nestjs/testing";
import { HealthScoreService } from "./health-score.service";
import { PrismaService } from "../../prisma/prisma.service";

describe("HealthScoreService", () => {
    let service: HealthScoreService;
    let prisma: PrismaService;

    const mockPrismaService = {
        debt: {
            findMany: jest.fn(),
        },
        investmentAccount: {
            findMany: jest.fn(),
        },
        account: {
            findMany: jest.fn(),
        },
        incomeSource: {
            findMany: jest.fn(),
        },
        fixedExpense: {
            findMany: jest.fn(),
        },
        dailyHealthScore: {
            findFirst: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                HealthScoreService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<HealthScoreService>(HealthScoreService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("calculateScore", () => {
        const userId = "user-1";

        it("should calculate max score for perfect user (no debt, high investments, huge reserves)", async () => {
            // Mock Data
            mockPrismaService.debt.findMany.mockResolvedValue([]);
            mockPrismaService.incomeSource.findMany.mockResolvedValue([
                { amount: 10000 },
            ]); // Monthly Income: 10k
            mockPrismaService.investmentAccount.findMany.mockResolvedValue([
                { balance: 70000 },
            ]); // Invested: 70k ( > 6x income)
            mockPrismaService.fixedExpense.findMany.mockResolvedValue([
                { amount: 5000 },
            ]); // Fix expenses: 5k
            // Estimated Spend: 5k * 1.5 = 7.5k
            mockPrismaService.account.findMany.mockResolvedValue([
                { balance: 30000 },
            ]); // Cash: 30k ( > 3x spend)

            // Setup History Mock (First time today)
            mockPrismaService.dailyHealthScore.findFirst.mockResolvedValue(
                null
            );

            const result = await service.calculateScore(userId);

            // Calculations:
            // Base: 1000
            // Debt Penalty: 0 (No debts)
            // Inv Bonus: +50 (started) + 50 (>1x) + 100 (>6x) = +200
            // Reserve Bonus: +100 (>3x spend)
            // Total: 1300 -> Capped at 1000

            expect(result.score).toBe(1000);
            expect(
                mockPrismaService.dailyHealthScore.create
            ).toHaveBeenCalled();
        });

        it("should apply severe penalties for high debt", async () => {
            mockPrismaService.debt.findMany.mockResolvedValue([
                { totalAmount: 50000 },
            ]); // High debt
            mockPrismaService.incomeSource.findMany.mockResolvedValue([
                { amount: 5000 },
            ]); // Low income
            mockPrismaService.investmentAccount.findMany.mockResolvedValue([]);
            mockPrismaService.fixedExpense.findMany.mockResolvedValue([]);
            mockPrismaService.account.findMany.mockResolvedValue([]);

            mockPrismaService.dailyHealthScore.findFirst.mockResolvedValue(
                null
            );

            const result = await service.calculateScore(userId);

            // Calculations:
            // Base: 1000
            // Debt Penalty:
            // - Debt (50k) > 3 * Income (15k)? Yes -> +200
            // - Count Penalty: 1 * 20 = 20
            // Total Penalty: 220
            // Bonuses: 0
            // Score: 1000 - 220 = 780

            expect(result.score).toBe(780);
        });

        it("should update existing daily score if already calculated", async () => {
            mockPrismaService.debt.findMany.mockResolvedValue([]);
            mockPrismaService.incomeSource.findMany.mockResolvedValue([]);
            mockPrismaService.investmentAccount.findMany.mockResolvedValue([]);
            mockPrismaService.fixedExpense.findMany.mockResolvedValue([]);
            mockPrismaService.account.findMany.mockResolvedValue([]);

            // Existing record found
            mockPrismaService.dailyHealthScore.findFirst.mockResolvedValue({
                id: "score-1",
            });

            await service.calculateScore(userId);

            expect(
                mockPrismaService.dailyHealthScore.update
            ).toHaveBeenCalledWith({
                where: { id: "score-1" },
                data: expect.any(Object),
            });
            expect(
                mockPrismaService.dailyHealthScore.create
            ).not.toHaveBeenCalled();
        });
    });

    describe("getLatestScore", () => {
        const userId = "user-1";

        it("should return latest stored score if available", async () => {
            mockPrismaService.dailyHealthScore.findFirst.mockResolvedValue({
                score: 850,
                debtPenalty: 50,
                investmentBonus: 0,
                reserveBonus: 0,
                date: new Date(),
            });

            const result = await service.getLatestScore(userId);
            expect(result.score).toBe(850);
        });

        it("should calculate score on fly if no history exists", async () => {
            mockPrismaService.dailyHealthScore.findFirst.mockResolvedValue(
                null
            );

            // Mock calculate dependencies
            mockPrismaService.debt.findMany.mockResolvedValue([]);
            mockPrismaService.incomeSource.findMany.mockResolvedValue([]);
            mockPrismaService.investmentAccount.findMany.mockResolvedValue([]);
            mockPrismaService.fixedExpense.findMany.mockResolvedValue([]);
            mockPrismaService.account.findMany.mockResolvedValue([]);
            mockPrismaService.dailyHealthScore.findFirst.mockResolvedValue(
                null
            ); // Inside calculateScore

            const result = await service.getLatestScore(userId);

            // Base score 1000 since no data
            expect(result.score).toBe(1000);
            expect(
                mockPrismaService.dailyHealthScore.create
            ).toHaveBeenCalled();
        });
    });
});
