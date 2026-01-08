import { Module } from "@nestjs/common";
import { IncomeService } from "./income.service";
import { IncomeController } from "./income.controller";
import { PrismaModule } from "../../prisma/prisma.module";
import { ProjectedIncomeController } from "./projected-income.controller";
import { ProjectedIncomeService } from "./projected-income.service";

@Module({
    imports: [PrismaModule],
    controllers: [IncomeController, ProjectedIncomeController],
    providers: [IncomeService, ProjectedIncomeService],
})
export class IncomeModule {}
