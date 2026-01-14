import { Module } from "@nestjs/common";
import { SystemConfigService } from "./system-config.service";
import { SystemConfigController } from "./system-config.controller";
import { PrismaService } from "../../prisma/prisma.service";

@Module({
    controllers: [SystemConfigController],
    providers: [SystemConfigService, PrismaService],
    exports: [SystemConfigService],
})
export class SystemConfigModule {}
