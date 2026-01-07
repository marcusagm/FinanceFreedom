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
        @Body()
        body: {
            debtBalance: number;
            monthlyInterestRate: number;
            daysLate: number;
        }
    ) {
        return this.simulatorService.calculateDelayCost(
            body.debtBalance,
            body.monthlyInterestRate,
            body.daysLate
        );
    }

    @Post("prepayment-savings")
    async calculatePrepaymentSavings(
        @Body()
        body: {
            debtBalance: number;
            monthlyInterestRate: number;
            minimumPayment: number;
            prepaymentAmount: number;
        }
    ) {
        return this.simulatorService.calculatePrepaymentSavings(
            body.debtBalance,
            body.monthlyInterestRate,
            body.minimumPayment,
            body.prepaymentAmount
        );
    }
}
