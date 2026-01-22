import {
    Body,
    Controller,
    Get,
    Post,
    Query,
    Req,
    UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { BudgetService } from "./budget.service";
import { UpsertBudgetDto } from "./dto/upsert-budget.dto";

@Controller("budgets")
@UseGuards(JwtAuthGuard)
export class BudgetController {
    constructor(private readonly budgetService: BudgetService) {}

    @Get()
    async getBudgets(@Req() req: any, @Query("date") date?: string) {
        // If date is provided, parse it. Else undefined (current month)
        const targetDate = date ? new Date(date) : undefined;
        return this.budgetService.getBudgetStatus(req.user.userId, targetDate);
    }

    @Post()
    async upsertBudget(@Req() req: any, @Body() dto: UpsertBudgetDto) {
        return this.budgetService.upsertBudget(
            req.user.userId,
            dto.categoryId,
            dto.amount,
            new Date(dto.date),
        );
    }
}
