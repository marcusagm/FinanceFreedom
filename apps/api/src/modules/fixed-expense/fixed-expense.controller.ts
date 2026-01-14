import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
} from "@nestjs/common";
import { FixedExpenseService } from "./fixed-expense.service";
import { CreateFixedExpenseDto } from "./dto/create-fixed-expense.dto";
import { UpdateFixedExpenseDto } from "./dto/update-fixed-expense.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("fixed-expenses")
@UseGuards(JwtAuthGuard)
export class FixedExpenseController {
    constructor(private readonly fixedExpenseService: FixedExpenseService) {}

    @Post()
    create(@Request() req: any, @Body() createDto: CreateFixedExpenseDto) {
        return this.fixedExpenseService.create(req.user.userId, createDto);
    }

    @Get()
    findAll(@Request() req: any) {
        return this.fixedExpenseService.findAll(req.user.userId);
    }

    @Get(":id")
    findOne(@Request() req: any, @Param("id") id: string) {
        return this.fixedExpenseService.findOne(req.user.userId, id);
    }

    @Patch(":id")
    update(
        @Request() req: any,
        @Param("id") id: string,
        @Body() updateDto: UpdateFixedExpenseDto
    ) {
        return this.fixedExpenseService.update(req.user.userId, id, updateDto);
    }

    @Delete(":id")
    remove(@Request() req: any, @Param("id") id: string) {
        return this.fixedExpenseService.remove(req.user.userId, id);
    }
}
