import { Test, TestingModule } from "@nestjs/testing";
import { SimulatorService } from "./simulator.service";
import { PrismaService } from "../../prisma/prisma.service";
import { Decimal } from "@prisma/client/runtime/library";
import { NotFoundException } from "@nestjs/common";

describe("SimulatorService", () => {
    let service: SimulatorService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SimulatorService,
                {
                    provide: PrismaService,
                    useValue: {
                        transaction: {
                            aggregate: jest.fn(),
                        },
                        account: {
                            findUnique: jest.fn(),
                        },
                    },
                },
            ],
        }).compile();

        service = module.get<SimulatorService>(SimulatorService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe("calculateHourlyRate", () => {
        it("should calculate hourly rate correctly", async () => {
            jest.spyOn(
                prismaService.transaction,
                "aggregate"
            ).mockResolvedValue({
                _sum: { amount: new Decimal(16000) }, // 16000 Income
            } as any);

            const rate = await service.calculateHourlyRate();
            // 16000 / 160 = 100
            expect(rate).toBe(100);
        });

        it("should return 0 if no income", async () => {
            jest.spyOn(
                prismaService.transaction,
                "aggregate"
            ).mockResolvedValue({
                _sum: { amount: null },
            } as any);

            const rate = await service.calculateHourlyRate();
            expect(rate).toBe(0);
        });
    });

    describe("calculateDelayCost", () => {
        it("should calculate delay cost correctly", async () => {
            // Pure logic test, no mocks needed
            const result = await service.calculateDelayCost(1000, 10, 5);
            // Debt = 1000
            // Fine = 20 (2%)
            // Daily Rate = (10/100)/30 = 0.00333...
            // Interest = 1000 * 0.00333 * 5 = 16.66...
            // Total approx = 36.66

            expect(result.fine).toBe(20);
            expect(result.interest).toBeCloseTo(16.66, 1);
            expect(result.totalCost).toBeCloseTo(36.66, 1);
        });

        it("should return 0 cost if no balance", async () => {
            const result = await service.calculateDelayCost(0, 10, 5);
            expect(result.totalCost).toBe(0);
        });
    });

    describe("calculatePrepaymentSavings", () => {
        it("should calculate savings correctly", async () => {
            // Pure logic test
            const result = await service.calculatePrepaymentSavings(
                5000,
                5,
                250,
                1000
            );

            // Just ensure it returns positive savings
            expect(result.interestSaved).toBeGreaterThan(0);
            expect(result.prepaymentAmount).toBe(1000);
        });

        it("should return 0 savings if no balance", async () => {
            const result = await service.calculatePrepaymentSavings(
                0,
                10,
                50,
                100
            );
            expect(result.interestSaved).toBe(0);
        });
    });

    describe("calculateTimeCost", () => {
        it("should return correct hours", () => {
            const result = service.calculateTimeCost(100, 50);
            expect(result).toBe(2);
        });

        it("should return 0 if hourlyRate is 0", () => {
            const result = service.calculateTimeCost(100, 0);
            expect(result).toBe(0);
        });
    });
});
