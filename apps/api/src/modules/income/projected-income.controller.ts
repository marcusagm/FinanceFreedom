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
    Request,
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
        @Request() req: any,
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

        return this.projectedIncomeService.create(req.user.userId, {
            workUnit: { connect: { id: createDto.workUnitId } },
            date: new Date(createDto.date),
            amount: createDto.amount,
            status: createDto.status || "PLANNED",
        });
    }

    @Post("distribute")
    distribute(
        @Request() req: any,
        @Body()
        dto: {
            workUnitId: string;
            startDate: string;
            hoursPerDay?: number;
            skipWeekends?: boolean;
        }
    ) {
        if (!dto.workUnitId || !dto.startDate) {
            throw new BadRequestException("Missing workUnitId or startDate");
        }
        return this.projectedIncomeService.distribute(req.user.userId, {
            workUnitId: dto.workUnitId,
            startDate: new Date(dto.startDate),
            hoursPerDay: dto.hoursPerDay,
            skipWeekends: dto.skipWeekends,
        });
    }

    @Get()
    findAll(@Request() req: any, @Query("month") monthStr: string) {
        // monthStr expected format: YYYY-MM
        const date = monthStr
            ? new Date(`${monthStr}-01T00:00:00`)
            : new Date();
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        return this.projectedIncomeService.findAll(
            req.user.userId,
            startOfMonth,
            endOfMonth
        );
    }

    @Patch(":id")
    update(
        @Request() req: any,
        @Param("id") id: string,
        @Body() updateDto: { status?: string; date?: string; amount?: number }
    ) {
        const data: Prisma.ProjectedIncomeUpdateInput = {};
        if (updateDto.status) data.status = updateDto.status;
        if (updateDto.date) data.date = new Date(updateDto.date);
        if (updateDto.amount) data.amount = updateDto.amount;

        return this.projectedIncomeService.update(req.user.userId, id, data);
    }

    @Delete(":id")
    remove(@Request() req: any, @Param("id") id: string) {
        return this.projectedIncomeService.remove(req.user.userId, id);
    }
}
