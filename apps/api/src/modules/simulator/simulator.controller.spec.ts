import { Test, TestingModule } from "@nestjs/testing";
import { SimulatorController } from "./simulator.controller";
import { SimulatorService } from "./simulator.service";

describe("SimulatorController", () => {
    let controller: SimulatorController;
    let service: SimulatorService;

    const mockService = {
        calculateHourlyRate: jest.fn(),
        calculateDelayCost: jest.fn(),
        calculatePrepaymentSavings: jest.fn(),
        calculateTimeCost: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SimulatorController],
            providers: [{ provide: SimulatorService, useValue: mockService }],
        }).compile();

        controller = module.get<SimulatorController>(SimulatorController);
        service = module.get<SimulatorService>(SimulatorService);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("getHourlyRate", () => {
        it("should return the hourly rate", async () => {
            const result = 50;
            mockService.calculateHourlyRate.mockResolvedValue(result);

            expect(await controller.getHourlyRate()).toEqual({
                hourlyRate: result,
            });
        });
    });

    describe("calculateDelayCost", () => {
        it("should calculate delay cost", async () => {
            const body = {
                debtBalance: 1000,
                monthlyInterestRate: 0.05,
                daysLate: 10,
            };
            const result = 100;
            mockService.calculateDelayCost.mockResolvedValue(result);

            expect(await controller.calculateDelayCost(body)).toBe(result);
            expect(mockService.calculateDelayCost).toHaveBeenCalledWith(
                body.debtBalance,
                body.monthlyInterestRate,
                body.daysLate
            );
        });
    });

    describe("calculatePrepaymentSavings", () => {
        it("should calculate prepayment savings", async () => {
            const body = {
                debtBalance: 1000,
                monthlyInterestRate: 0.05,
                minimumPayment: 100,
                prepaymentAmount: 50,
            };
            const result = { totalSavings: 200, timeSavedMonths: 2 };
            mockService.calculatePrepaymentSavings.mockResolvedValue(result);

            expect(await controller.calculatePrepaymentSavings(body)).toBe(
                result
            );
            expect(mockService.calculatePrepaymentSavings).toHaveBeenCalledWith(
                body.debtBalance,
                body.monthlyInterestRate,
                body.minimumPayment,
                body.prepaymentAmount
            );
        });
    });

    describe("calculateTimeCost", () => {
        it("should calculate time cost", () => {
            const body = { amount: 100, hourlyRate: 50 };
            const result = 2;
            mockService.calculateTimeCost.mockReturnValue(result);

            expect(controller.calculateTimeCost(body)).toEqual({
                timeCost: result,
            });
            expect(mockService.calculateTimeCost).toHaveBeenCalledWith(
                body.amount,
                body.hourlyRate
            );
        });
    });
});
