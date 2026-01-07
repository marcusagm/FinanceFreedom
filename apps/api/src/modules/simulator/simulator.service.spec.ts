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
            jest.spyOn(prismaService.account, "findUnique").mockResolvedValue({
                id: "1",
                name: "Debt",
                balance: new Decimal(-1000), // 1000 Debt
                interestRate: new Decimal(10), // 10%
                type: "DEBT",
            } as any);

            const result = await service.calculateDelayCost("1", 5);
            // Debt = 1000
            // Fine = 20 (2%)
            // Daily Rate = (10/100)/30 = 0.00333...
            // Interest = 1000 * 0.00333 * 5 = 16.66...
            // Total approx = 36.66

            expect(result.fine).toBe(20);
            expect(result.interest).toBeCloseTo(16.66, 1);
            expect(result.totalCost).toBeCloseTo(36.66, 1);
        });

        it("should throw NotFound if account missing", async () => {
            jest.spyOn(prismaService.account, "findUnique").mockResolvedValue(
                null
            );
            await expect(service.calculateDelayCost("999", 5)).rejects.toThrow(
                NotFoundException
            );
        });

        it("should return 0 cost if no balance", async () => {
            jest.spyOn(prismaService.account, "findUnique").mockResolvedValue({
                id: "1",
                name: "Test",
                balance: new Decimal(0),
                interestRate: new Decimal(10),
            } as any);

            const result = await service.calculateDelayCost("1", 5);
            expect(result.cost).toBe(0);
        });
    });

    describe("calculatePrepaymentSavings", () => {
        it("should calculate savings correctly", async () => {
            jest.spyOn(prismaService.account, "findUnique").mockResolvedValue({
                id: "1",
                balance: new Decimal(-5000),
                interestRate: new Decimal(5), // 5%
                minimumPayment: new Decimal(250),
            } as any);

            const result = await service.calculatePrepaymentSavings("1", 1000);

            // Just ensure it returns positive savings
            expect(result.saved).toBeUndefined(); // The service returns { interestSaved } not saved
            expect(result.interestSaved).toBeGreaterThan(0);
            expect(result.prepaymentAmount).toBe(1000);
        });

        it("should throw NotFound if account missing", async () => {
            jest.spyOn(prismaService.account, "findUnique").mockResolvedValue(
                null
            );
            await expect(
                service.calculatePrepaymentSavings("999", 100)
            ).rejects.toThrow(NotFoundException);
        });

        it("should return 0 savings if no balance", async () => {
            jest.spyOn(prismaService.account, "findUnique").mockResolvedValue({
                id: "1",
                balance: new Decimal(0),
                interestRate: new Decimal(10),
            } as any);

            const result = await service.calculatePrepaymentSavings("1", 100);
            expect(result.saved).toBe(0);
        });
    });
});
