import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Request,
    UseGuards,
} from "@nestjs/common";
import { SavingsGoalService } from "./savings-goal.service";
import { CreateSavingsGoalDto } from "./dto/create-savings-goal.dto";
import { UpdateSavingsGoalDto } from "./dto/update-savings-goal.dto";

@Controller("savings-goals")
export class SavingsGoalController {
    constructor(private readonly savingsGoalService: SavingsGoalService) {}

    @Post()
    create(
        @Request() req: any,
        @Body() createSavingsGoalDto: CreateSavingsGoalDto
    ) {
        return this.savingsGoalService.create(
            req.user.userId,
            createSavingsGoalDto
        );
    }

    @Get()
    findAll(@Request() req: any) {
        return this.savingsGoalService.findAll(req.user.userId);
    }

    @Get(":id")
    findOne(@Request() req: any, @Param("id") id: string) {
        return this.savingsGoalService.findOne(req.user.userId, id);
    }

    @Patch(":id")
    update(
        @Request() req: any,
        @Param("id") id: string,
        @Body() updateSavingsGoalDto: UpdateSavingsGoalDto
    ) {
        return this.savingsGoalService.update(
            req.user.userId,
            id,
            updateSavingsGoalDto
        );
    }

    @Delete(":id")
    remove(@Request() req: any, @Param("id") id: string) {
        return this.savingsGoalService.remove(req.user.userId, id);
    }
}
