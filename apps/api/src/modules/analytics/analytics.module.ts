import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { AnalyticsController } from "./analytics.controller";
import { BudgetService } from "./budget.service";
import { HealthScoreService } from "./health-score.service";

@Module({
    imports: [PrismaModule],
    controllers: [AnalyticsController],
    providers: [BudgetService, HealthScoreService],
    exports: [BudgetService, HealthScoreService],
})
export class AnalyticsModule {}
