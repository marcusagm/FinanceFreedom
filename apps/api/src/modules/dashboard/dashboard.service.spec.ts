import { Test, TestingModule } from "@nestjs/testing";
import { DashboardService } from "./dashboard.service";
import { PrismaService } from "../../prisma/prisma.service";

import { DebtService } from "../debt/debt.service";

describe("DashboardService", () => {
    let service: DashboardService;
    let prisma: PrismaService;
    let debtService: DebtService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DashboardService,
                {
                    provide: PrismaService,
                    useValue: {
                        account: {
                            findMany: jest.fn().mockResolvedValue([]),
                        },
                        transaction: {
                            findMany: jest.fn().mockResolvedValue([]),
                        },
                    },
                },
                {
                    provide: DebtService,
                    useValue: {
                        getSortedDebts: jest.fn().mockResolvedValue([]),
                    },
                },
            ],
        }).compile();

        service = module.get<DashboardService>(DashboardService);
        prisma = module.get<PrismaService>(PrismaService);
        debtService = module.get<DebtService>(DebtService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("getSummary", () => {
        it("should return correct total balance", async () => {
            // Mock accounts
            (prisma.account.findMany as jest.Mock).mockResolvedValue([
                { balance: 100 },
                { balance: 200 },
            ]);

            const result = await service.getSummary();
            expect(result.totalBalance).toBe(300);
        });

        it("should return correct monthly income and expenses", async () => {
            // Mock transactions
            const today = new Date();
            (prisma.transaction.findMany as jest.Mock).mockImplementation(
                (args) => {
                    // If searching for monthly aggregation (first call in getSummary)
                    if (args.where.date.lte) {
                        return Promise.resolve([
                            { type: "INCOME", amount: 50 },
                            { type: "EXPENSE", amount: 20 },
                        ]);
                    }
                    // If searching for chart data (second call in getSummary)
                    return Promise.resolve([]);
                }
            );

            const result = await service.getSummary();
            expect(result.monthlyIncome).toBe(50);
            expect(result.monthlyExpenses).toBe(20);
        });

        it("should recommend PAY_DEBT if free cash flow > 0 and debts exist", async () => {
            // Free Cash Flow = 50 - 20 = 30
            (prisma.transaction.findMany as jest.Mock).mockImplementation(
                (args) => {
                    if (args.where.date.lte) {
                        return Promise.resolve([
                            { type: "INCOME", amount: 50 },
                            { type: "EXPENSE", amount: 20 },
                        ]);
                    }
                    return Promise.resolve([]);
                }
            );

            (debtService.getSortedDebts as jest.Mock).mockResolvedValue([
                { id: "1", name: "High Interest Debt", interestRate: 10 },
            ]);

            const result = await service.getSummary();

            expect(result.recommendations).toHaveLength(1);
            expect(result.recommendations[0].type).toBe("PAY_DEBT");
            expect(result.recommendations[0].title).toContain(
                "High Interest Debt"
            );
        });

        it("should recommend INVEST if free cash flow > 0 and NO debts exist", async () => {
            // Free Cash Flow = 50 - 20 = 30
            (prisma.transaction.findMany as jest.Mock).mockImplementation(
                (args) => {
                    if (args.where.date.lte) {
                        return Promise.resolve([
                            { type: "INCOME", amount: 50 },
                            { type: "EXPENSE", amount: 20 },
                        ]);
                    }
                    return Promise.resolve([]);
                }
            );

            (debtService.getSortedDebts as jest.Mock).mockResolvedValue([]);

            const result = await service.getSummary();

            expect(result.recommendations).toHaveLength(1);
            expect(result.recommendations[0].type).toBe("INVEST");
        });

        it("should recommend INCOME_GAP if free cash flow < 0", async () => {
            // Free Cash Flow = 20 - 50 = -30
            (prisma.transaction.findMany as jest.Mock).mockImplementation(
                (args) => {
                    if (args.where.date.lte) {
                        return Promise.resolve([
                            { type: "INCOME", amount: 20 },
                            { type: "EXPENSE", amount: 50 },
                        ]);
                    }
                    return Promise.resolve([]);
                }
            );

            const result = await service.getSummary();

            expect(result.recommendations).toHaveLength(1);
            expect(result.recommendations[0].type).toBe("INCOME_GAP");
            expect(result.recommendations[0].description).toContain("30.00");
        });
    });
});
