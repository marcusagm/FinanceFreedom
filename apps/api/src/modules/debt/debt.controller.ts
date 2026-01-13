import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    Request,
} from "@nestjs/common";
import { DebtService } from "./debt.service";
import { CreateDebtDto } from "./dto/create-debt.dto";
import { UpdateDebtDto } from "./dto/update-debt.dto";

@Controller("debts")
export class DebtController {
    constructor(private readonly debtService: DebtService) {}

    @Post()
    create(@Request() req: any, @Body() createDebtDto: CreateDebtDto) {
        return this.debtService.create(req.user.userId, createDebtDto);
    }

    @Get()
    findAll(@Request() req: any) {
        return this.debtService.findAll(req.user.userId);
    }

    @Get("strategy")
    getStrategy(
        @Request() req: any,
        @Query("type") type: "SNOWBALL" | "AVALANCHE",
        @Query("monthlyExtra") monthlyExtra?: string
    ) {
        return this.debtService.getSortedDebts(
            req.user.userId,
            type,
            Number(monthlyExtra) || 0
        );
    }

    @Get(":id")
    findOne(@Request() req: any, @Param("id") id: string) {
        return this.debtService.findOne(req.user.userId, id);
    }

    @Patch(":id")
    update(
        @Request() req: any,
        @Param("id") id: string,
        @Body() updateDebtDto: UpdateDebtDto
    ) {
        return this.debtService.update(req.user.userId, id, updateDebtDto);
    }

    @Delete(":id")
    remove(@Request() req: any, @Param("id") id: string) {
        return this.debtService.remove(req.user.userId, id);
    }
}
