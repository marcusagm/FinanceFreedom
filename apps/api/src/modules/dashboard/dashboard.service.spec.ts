import { Test, TestingModule } from "@nestjs/testing";
import { DashboardService } from "./dashboard.service";
import { PrismaService } from "../../prisma/prisma.service";

describe("DashboardService", () => {
    let service: DashboardService;
    let prisma: PrismaService;

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
            ],
        }).compile();

        service = module.get<DashboardService>(DashboardService);
        prisma = module.get<PrismaService>(PrismaService);
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
    });
});
