import { Test, TestingModule } from "@nestjs/testing";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { DebtService } from "./debt.service";
import { PrismaService } from "../../prisma/prisma.service";

const mockPrismaService = {
    debt: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
    },
};

describe("DebtService", () => {
    let service: DebtService;
    let prisma: typeof mockPrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DebtService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<DebtService>(DebtService);
        prisma = module.get(PrismaService);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("create", () => {
        it("should create a debt", async () => {
            const dto = {
                name: "Test Debt",
                totalAmount: 1000,
                interestRate: 5,
                minimumPayment: 100,
                dueDate: 10,
                priority: 1,
            };
            const result = {
                id: "uuid",
                ...dto,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            // @ts-ignore
            prisma.debt.create.mockResolvedValue(result);

            expect(await service.create(dto)).toEqual(result);
            expect(prisma.debt.create).toHaveBeenCalledWith({ data: dto });
        });
    });

    describe("findAll", () => {
        it("should return an array of debts", async () => {
            const result = [
                {
                    id: "1",
                    name: "Debt 1",
                    totalAmount: 100,
                    interestRate: 1,
                    minimumPayment: 10,
                    dueDate: 1,
                    priority: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];
            // @ts-ignore
            prisma.debt.findMany.mockResolvedValue(result);

            expect(await service.findAll()).toEqual(result);
            expect(prisma.debt.findMany).toHaveBeenCalled();
        });
    });

    describe("findOne", () => {
        it("should return a single debt", async () => {
            const result = {
                id: "1",
                name: "Debt 1",
                totalAmount: 100,
                interestRate: 1,
                minimumPayment: 10,
                dueDate: 1,
                priority: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            // @ts-ignore
            prisma.debt.findUnique.mockResolvedValue(result);

            expect(await service.findOne("1")).toEqual(result);
            expect(prisma.debt.findUnique).toHaveBeenCalledWith({
                where: { id: "1" },
            });
        });
    });

    describe("update", () => {
        it("should update a debt", async () => {
            const dto = {
                name: "Updated Name",
                totalAmount: 100,
                interestRate: 1,
                minimumPayment: 10,
                dueDate: 1,
                priority: 1,
            };
            const result = {
                id: "1",
                name: "Updated Name",
                totalAmount: 100,
                interestRate: 1,
                minimumPayment: 10,
                dueDate: 1,
                priority: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            // @ts-ignore
            prisma.debt.update.mockResolvedValue(result);

            expect(await service.update("1", dto)).toEqual(result);
            expect(prisma.debt.update).toHaveBeenCalledWith({
                where: { id: "1" },
                data: dto,
            });
        });
    });

    describe("remove", () => {
        it("should remove a debt", async () => {
            const result = {
                id: "1",
                name: "Debt 1",
                totalAmount: 100,
                interestRate: 1,
                minimumPayment: 10,
                dueDate: 1,
                priority: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            // @ts-ignore
            prisma.debt.delete.mockResolvedValue(result);

            expect(await service.remove("1")).toEqual(result);
            expect(prisma.debt.delete).toHaveBeenCalledWith({
                where: { id: "1" },
            });
        });
    });
    describe("getSortedDebts", () => {
        it("should return debts and projection", async () => {
            const debts = [
                {
                    id: "1",
                    totalAmount: 1000,
                    interestRate: 5,
                    minimumPayment: 100,
                },
            ];
            // @ts-ignore
            prisma.debt.findMany.mockResolvedValue(debts);

            const result = await service.getSortedDebts("SNOWBALL", 0);

            expect(result).toHaveProperty("debts");
            expect(result).toHaveProperty("projection");
            expect(result.projection).toHaveProperty("monthsToPayoff");
            expect(result.projection).toHaveProperty("totalInterest");
        });
    });
});
