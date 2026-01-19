import { Controller, Get, Request, UseGuards } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";
import { I18nLang } from "nestjs-i18n";

@Controller("dashboard")
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}

    @Get("summary")
    async getSummary(@Request() req: any, @I18nLang() lang: string) {
        return this.dashboardService.getSummary(req.user.userId, lang);
    }
}
