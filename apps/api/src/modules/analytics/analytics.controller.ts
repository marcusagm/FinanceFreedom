import { Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { BudgetService } from "./budget.service";
import { HealthScoreService } from "./health-score.service";

@Controller("analytics")
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
    constructor(
        private readonly budgetService: BudgetService,
        private readonly healthScoreService: HealthScoreService,
    ) {}

    @Get("budgets")
    async getBudgets(@Req() req: any) {
        return this.budgetService.getBudgetStatus(req.user.userId);
    }

    @Get("health-score")
    async getHealthScore(@Req() req: any) {
        return this.healthScoreService.getLatestScore(req.user.userId);
    }

    @Post("health-score/calculate")
    async calculateHealthScore(@Req() req: any) {
        return this.healthScoreService.calculateScore(req.user.userId);
    }

    @Get("incomes")
    async getIncomes(@Req() req: any, @Query("date") date?: string) {
        const targetDate = date ? new Date(date) : undefined;
        return this.budgetService.getIncomeDistribution(
            req.user.userId,
            targetDate,
        );
    }
}
