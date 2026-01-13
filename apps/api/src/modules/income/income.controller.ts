import {
    Controller,
    Get,
    Post,
    Body,
    Delete,
    Param,
    Patch,
    Request,
} from "@nestjs/common";
import { IncomeService } from "./income.service";
import { CreateIncomeSourceDto } from "./dto/create-income-source.dto";
import { CreateWorkUnitDto } from "./dto/create-work-unit.dto";

@Controller("income")
export class IncomeController {
    constructor(private readonly incomeService: IncomeService) {}

    @Post("sources")
    createSource(
        @Request() req: any,
        @Body() createIncomeSourceDto: CreateIncomeSourceDto
    ) {
        return this.incomeService.createIncomeSource(
            req.user.userId,
            createIncomeSourceDto
        );
    }

    @Get("sources")
    findAllSources(@Request() req: any) {
        return this.incomeService.findAllIncomeSources(req.user.userId);
    }

    @Patch("sources/:id")
    updateSource(
        @Request() req: any,
        @Param("id") id: string,
        @Body() updateIncomeSourceDto: Partial<CreateIncomeSourceDto>
    ) {
        return this.incomeService.updateIncomeSource(
            req.user.userId,
            id,
            updateIncomeSourceDto
        );
    }

    @Delete("sources/:id")
    deleteSource(@Request() req: any, @Param("id") id: string) {
        return this.incomeService.deleteIncomeSource(req.user.userId, id);
    }

    @Post("work-units")
    createWorkUnit(
        @Request() req: any,
        @Body() createWorkUnitDto: CreateWorkUnitDto
    ) {
        return this.incomeService.createWorkUnit(
            req.user.userId,
            createWorkUnitDto
        );
    }

    @Get("work-units")
    findAllWorkUnits(@Request() req: any) {
        return this.incomeService.findAllWorkUnits(req.user.userId);
    }

    @Patch("work-units/:id")
    updateWorkUnit(
        @Request() req: any,
        @Param("id") id: string,
        @Body() updateWorkUnitDto: Partial<CreateWorkUnitDto>
    ) {
        return this.incomeService.updateWorkUnit(
            req.user.userId,
            id,
            updateWorkUnitDto
        );
    }

    @Delete("work-units/:id")
    deleteWorkUnit(@Request() req: any, @Param("id") id: string) {
        return this.incomeService.deleteWorkUnit(req.user.userId, id);
    }
}
