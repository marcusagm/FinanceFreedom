import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Request,
    UseGuards,
} from "@nestjs/common";
import { SystemConfigService } from "./system-config.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("system-config")
export class SystemConfigController {
    constructor(private readonly systemConfigService: SystemConfigService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAll(@Request() req: any) {
        return this.systemConfigService.getAll(req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(":key")
    async get(@Request() req: any, @Param("key") key: string) {
        return this.systemConfigService.get(req.user.userId, key);
    }

    @UseGuards(JwtAuthGuard)
    @Put(":key")
    async set(
        @Request() req: any,
        @Param("key") key: string,
        @Body("value") value: string
    ) {
        return this.systemConfigService.set(req.user.userId, key, value);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async setMany(@Request() req: any, @Body() body: Record<string, string>) {
        // Save multiple configs
        const userId = req.user.userId;
        const promises = Object.entries(body).map(([key, value]) =>
            this.systemConfigService.set(userId, key, value)
        );
        await Promise.all(promises);
        return this.systemConfigService.getAll(userId);
    }
}
