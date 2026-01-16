import { Test, TestingModule } from "@nestjs/testing";
import { AnalyticsModule } from "./analytics.module";
import { BudgetService } from "./budget.service";
import { HealthScoreService } from "./health-score.service";
import { PrismaService } from "../../prisma/prisma.service";

describe("AnalyticsModule", () => {
    let module: TestingModule;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            imports: [AnalyticsModule],
        })
            .overrideProvider(PrismaService)
            .useValue({
                // Mock PrismaService methods if needed by services on valid initialization
            })
            .compile();
    });

    it("should be defined", () => {
        expect(module).toBeDefined();
    });

    it("should provide BudgetService", () => {
        const service = module.get<BudgetService>(BudgetService);
        expect(service).toBeDefined();
    });

    it("should provide HealthScoreService", () => {
        const service = module.get<HealthScoreService>(HealthScoreService);
        expect(service).toBeDefined();
    });
});
