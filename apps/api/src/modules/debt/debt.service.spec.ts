import { Test, TestingModule } from "@nestjs/testing";
import { DebtService } from "./debt.service";
import { PrismaService } from "../../prisma/prisma.service";
// import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

const mockPrismaService = {
    debt: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findFirstOrThrow: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
};

describe("DebtService", () => {
    let service: DebtService;
    let prisma: typeof mockPrismaService;

    beforeEach(async () => {
        service = new DebtService(mockPrismaService as any);
        prisma = mockPrismaService;
    });

    afterEach(() => {
        jest.clearAllMocks();
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

            expect(await service.create("1", dto)).toEqual(result);
            expect(prisma.debt.create).toHaveBeenCalledWith({
                data: { ...dto, userId: "1", originalAmount: 1000 },
            });
        });

        it("should create a debt with installment fields", async () => {
            const dto = {
                name: "Installment Debt",
                totalAmount: 1000,
                interestRate: 0,
                minimumPayment: 100,
                dueDate: 15,
                installmentsTotal: 10,
                installmentsPaid: 0,
                firstInstallmentDate: "2026-01-15",
            };
            const result = {
                id: "uuid",
                ...dto,
                firstInstallmentDate: new Date("2026-01-15"),
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            // @ts-ignore
            prisma.debt.create.mockResolvedValue(result);

            const created = await service.create("1", dto);
            expect(created).toEqual(result);
            expect(prisma.debt.create).toHaveBeenCalledWith({
                data: {
                    ...dto,
                    firstInstallmentDate: new Date("2026-01-15"),
                    originalAmount: 1000,
                    userId: "1",
                },
            });
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

            expect(await service.findAll("1")).toEqual(result);
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
            prisma.debt.findFirst.mockResolvedValue(result);

            expect(await service.findOne("1", "1")).toEqual(result);
            expect(prisma.debt.findFirst).toHaveBeenCalledWith({
                where: { id: "1", userId: "1" },
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

            expect(await service.update("1", "1", dto)).toEqual(result);
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

            expect(await service.remove("1", "1")).toEqual(result);
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

            const result = await service.getSortedDebts("1", "SNOWBALL", 0);

            expect(result).toHaveProperty("debts");
            expect(result).toHaveProperty("projection");
            expect(result.projection).toHaveProperty("monthsToPayoff");
            expect(result.projection).toHaveProperty("totalInterest");
        });
    });
});
