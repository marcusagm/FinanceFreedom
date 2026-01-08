import { Test, TestingModule } from "@nestjs/testing";
import { IncomeService } from "./income.service";
import { PrismaService } from "../../prisma/prisma.service";

describe("IncomeService", () => {
    let service: IncomeService;
    let prisma: PrismaService;

    const mockIncomeSource = {
        id: "source-1",
        name: "Job",
        amount: 5000,
        payDay: 5,
        userId: "user-1", // if schema has userId
    };

    const mockWorkUnit = {
        id: "unit-1",
        name: "Logo",
        defaultPrice: 500,
        estimatedTime: 10,
    };

    const prismaMock = {
        incomeSource: {
            create: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        workUnit: {
            create: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                IncomeService,
                { provide: PrismaService, useValue: prismaMock },
            ],
        }).compile();

        service = module.get<IncomeService>(IncomeService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("createIncomeSource", () => {
        it("should create an income source", async () => {
            prismaMock.incomeSource.create.mockResolvedValue(mockIncomeSource);
            const dto = { name: "Job", amount: 5000, payDay: 5 };
            const result = await service.createIncomeSource(dto);
            expect(result).toEqual(mockIncomeSource);
            expect(prisma.incomeSource.create).toHaveBeenCalledWith({
                data: dto,
            });
        });
    });

    describe("findAllIncomeSources", () => {
        it("should return an array of income sources", async () => {
            prismaMock.incomeSource.findMany.mockResolvedValue([
                mockIncomeSource,
            ]);
            const result = await service.findAllIncomeSources();
            expect(result).toEqual([mockIncomeSource]);
        });
    });

    describe("updateIncomeSource", () => {
        it("should update an income source", async () => {
            const updateDto = { amount: 6000 };
            const updatedSource = { ...mockIncomeSource, amount: 6000 };
            prismaMock.incomeSource.update.mockResolvedValue(updatedSource);

            const result = await service.updateIncomeSource(
                "source-1",
                updateDto
            );
            expect(result).toEqual(updatedSource);
            expect(prisma.incomeSource.update).toHaveBeenCalledWith({
                where: { id: "source-1" },
                data: updateDto,
            });
        });
    });

    describe("deleteIncomeSource", () => {
        it("should delete an income source", async () => {
            prismaMock.incomeSource.delete.mockResolvedValue(mockIncomeSource);
            const result = await service.deleteIncomeSource("source-1");
            expect(result).toEqual(mockIncomeSource);
            expect(prisma.incomeSource.delete).toHaveBeenCalledWith({
                where: { id: "source-1" },
            });
        });
    });

    // Work Units Tests
    describe("createWorkUnit", () => {
        it("should create a work unit", async () => {
            prismaMock.workUnit.create.mockResolvedValue(mockWorkUnit);
            const dto = { name: "Logo", defaultPrice: 500, estimatedTime: 10 };
            const result = await service.createWorkUnit(dto);
            expect(result).toEqual(mockWorkUnit);
            expect(prisma.workUnit.create).toHaveBeenCalledWith({ data: dto });
        });
    });

    describe("findAllWorkUnits", () => {
        it("should return all work units", async () => {
            prismaMock.workUnit.findMany.mockResolvedValue([mockWorkUnit]);
            const result = await service.findAllWorkUnits();
            expect(result).toEqual([mockWorkUnit]);
        });
    });

    describe("updateWorkUnit", () => {
        it("should update a work unit", async () => {
            const updateDto = { defaultPrice: 600 };
            const updatedUnit = { ...mockWorkUnit, defaultPrice: 600 };
            prismaMock.workUnit.update.mockResolvedValue(updatedUnit);

            const result = await service.updateWorkUnit("unit-1", updateDto);
            expect(result).toEqual(updatedUnit);
            expect(prisma.workUnit.update).toHaveBeenCalledWith({
                where: { id: "unit-1" },
                data: updateDto,
            });
        });
    });

    describe("deleteWorkUnit", () => {
        it("should delete a work unit", async () => {
            prismaMock.workUnit.delete.mockResolvedValue(mockWorkUnit);
            const result = await service.deleteWorkUnit("unit-1");
            expect(result).toEqual(mockWorkUnit);
            expect(prisma.workUnit.delete).toHaveBeenCalledWith({
                where: { id: "unit-1" },
            });
        });
    });
});
