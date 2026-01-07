import { Controller, Get, Post, Body, Query } from "@nestjs/common";
import { SimulatorService } from "./simulator.service";

@Controller("simulators")
export class SimulatorController {
    constructor(private readonly simulatorService: SimulatorService) {}

    @Get("hourly-rate")
    async getHourlyRate() {
        return {
            hourlyRate: await this.simulatorService.calculateHourlyRate(),
        };
    }

    @Post("delay-cost")
    async calculateDelayCost(
        @Body() body: { accountId: string; daysLate: number }
    ) {
        return this.simulatorService.calculateDelayCost(
            body.accountId,
            body.daysLate
        );
    }

    @Post("prepayment-savings")
    async calculatePrepaymentSavings(
        @Body() body: { accountId: string; prepaymentAmount: number }
    ) {
        return this.simulatorService.calculatePrepaymentSavings(
            body.accountId,
            body.prepaymentAmount
        );
    }
}
