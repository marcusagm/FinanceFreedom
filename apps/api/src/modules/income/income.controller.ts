import {
    Controller,
    Get,
    Post,
    Body,
    Delete,
    Param,
    Patch,
} from "@nestjs/common";
import { IncomeService } from "./income.service";
import { CreateIncomeSourceDto } from "./dto/create-income-source.dto";
import { CreateWorkUnitDto } from "./dto/create-work-unit.dto";

@Controller("income")
export class IncomeController {
    constructor(private readonly incomeService: IncomeService) {}

    @Post("sources")
    createSource(@Body() createIncomeSourceDto: CreateIncomeSourceDto) {
        return this.incomeService.createIncomeSource(createIncomeSourceDto);
    }

    @Get("sources")
    findAllSources() {
        return this.incomeService.findAllIncomeSources();
    }

    @Patch("sources/:id")
    updateSource(
        @Param("id") id: string,
        @Body() updateIncomeSourceDto: Partial<CreateIncomeSourceDto>
    ) {
        return this.incomeService.updateIncomeSource(id, updateIncomeSourceDto);
    }

    @Delete("sources/:id")
    deleteSource(@Param("id") id: string) {
        return this.incomeService.deleteIncomeSource(id);
    }

    @Post("work-units")
    createWorkUnit(@Body() createWorkUnitDto: CreateWorkUnitDto) {
        return this.incomeService.createWorkUnit(createWorkUnitDto);
    }

    @Get("work-units")
    findAllWorkUnits() {
        return this.incomeService.findAllWorkUnits();
    }

    @Patch("work-units/:id")
    updateWorkUnit(
        @Param("id") id: string,
        @Body() updateWorkUnitDto: Partial<CreateWorkUnitDto>
    ) {
        return this.incomeService.updateWorkUnit(id, updateWorkUnitDto);
    }

    @Delete("work-units/:id")
    deleteWorkUnit(@Param("id") id: string) {
        return this.incomeService.deleteWorkUnit(id);
    }
}
