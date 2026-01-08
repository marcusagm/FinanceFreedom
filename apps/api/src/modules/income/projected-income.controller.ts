import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    BadRequestException,
} from "@nestjs/common";
import { ProjectedIncomeService } from "./projected-income.service";
import { Prisma } from "@prisma/client";

@Controller("income/projection")
export class ProjectedIncomeController {
    constructor(
        private readonly projectedIncomeService: ProjectedIncomeService
    ) {}

    @Post()
    create(
        @Body()
        createDto: {
            workUnitId: string;
            date: string;
            amount: number;
            status?: string;
        }
    ) {
        if (!createDto.workUnitId || !createDto.date || !createDto.amount) {
            throw new BadRequestException("Missing required fields");
        }

        return this.projectedIncomeService.create({
            workUnit: { connect: { id: createDto.workUnitId } },
            date: new Date(createDto.date),
            amount: createDto.amount,
            status: createDto.status || "PLANNED",
        });
    }

    @Get()
    findAll(@Query("month") monthStr: string) {
        // monthStr expected format: YYYY-MM
        const date = monthStr
            ? new Date(`${monthStr}-01T00:00:00`)
            : new Date();
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        return this.projectedIncomeService.findAll(startOfMonth, endOfMonth);
    }

    @Patch(":id")
    update(
        @Param("id") id: string,
        @Body() updateDto: { status?: string; date?: string; amount?: number }
    ) {
        const data: Prisma.ProjectedIncomeUpdateInput = {};
        if (updateDto.status) data.status = updateDto.status;
        if (updateDto.date) data.date = new Date(updateDto.date);
        if (updateDto.amount) data.amount = updateDto.amount;

        return this.projectedIncomeService.update(id, data);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.projectedIncomeService.remove(id);
    }
}
