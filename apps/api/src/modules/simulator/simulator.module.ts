import { Module } from "@nestjs/common";
import { SimulatorService } from "./simulator.service";
import { SimulatorController } from "./simulator.controller";
import { PrismaModule } from "../../prisma/prisma.module";

@Module({
    imports: [PrismaModule],
    controllers: [SimulatorController],
    providers: [SimulatorService],
})
export class SimulatorModule {}
