import { Test, TestingModule } from "@nestjs/testing";
import { IncomeController } from "./income.controller";
import { IncomeService } from "./income.service";

describe("IncomeController", () => {
    let controller: IncomeController;
    let service: IncomeService;

    const mockIncomeSource = {
        id: "source-1",
        name: "Job",
        amount: 5000,
        payDay: 5,
    };

    const mockWorkUnit = {
        id: "unit-1",
        name: "Logo",
        defaultPrice: 500,
        estimatedTime: 10,
        taxRate: 10,
    };

    const mockIncomeService = {
        createIncomeSource: jest.fn(),
        findAllIncomeSources: jest.fn(),
        updateIncomeSource: jest.fn(),
        deleteIncomeSource: jest.fn(),
        createWorkUnit: jest.fn(),
        findAllWorkUnits: jest.fn(),
        updateWorkUnit: jest.fn(),
        deleteWorkUnit: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [IncomeController],
            providers: [
                { provide: IncomeService, useValue: mockIncomeService },
            ],
        }).compile();

        controller = module.get<IncomeController>(IncomeController);
        service = module.get<IncomeService>(IncomeService);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    const mockRequest = { user: { userId: "1" } };

    describe("createSource", () => {
        it("should create source", async () => {
            mockIncomeService.createIncomeSource.mockResolvedValue(
                mockIncomeSource
            );
            const dto = { name: "Job", amount: 5000, payDay: 5 };
            expect(await controller.createSource(mockRequest, dto)).toEqual(
                mockIncomeSource
            );
            expect(service.createIncomeSource).toHaveBeenCalledWith("1", dto);
        });
    });

    describe("findAllSources", () => {
        it("should return array of sources", async () => {
            mockIncomeService.findAllIncomeSources.mockResolvedValue([
                mockIncomeSource,
            ]);
            expect(await controller.findAllSources(mockRequest)).toEqual([
                mockIncomeSource,
            ]);
            expect(service.findAllIncomeSources).toHaveBeenCalledWith("1");
        });
    });

    describe("updateSource", () => {
        it("should update source", async () => {
            const dto = { amount: 6000 };
            mockIncomeService.updateIncomeSource.mockResolvedValue({
                ...mockIncomeSource,
                ...dto,
            });
            expect(
                await controller.updateSource(mockRequest, "source-1", dto)
            ).toEqual({
                ...mockIncomeSource,
                ...dto,
            });
            expect(service.updateIncomeSource).toHaveBeenCalledWith(
                "1",
                "source-1",
                dto
            );
        });
    });

    describe("deleteSource", () => {
        it("should delete source", async () => {
            mockIncomeService.deleteIncomeSource.mockResolvedValue(
                mockIncomeSource
            );
            expect(
                await controller.deleteSource(mockRequest, "source-1")
            ).toEqual(mockIncomeSource);
            expect(service.deleteIncomeSource).toHaveBeenCalledWith(
                "1",
                "source-1"
            );
        });
    });

    describe("createWorkUnit", () => {
        it("should create work unit", async () => {
            mockIncomeService.createWorkUnit.mockResolvedValue(mockWorkUnit);
            const dto = {
                name: "Logo",
                defaultPrice: 500,
                estimatedTime: 10,
                taxRate: 10,
            };
            expect(await controller.createWorkUnit(mockRequest, dto)).toEqual(
                mockWorkUnit
            );
            expect(service.createWorkUnit).toHaveBeenCalledWith("1", dto);
        });
    });

    describe("findAllWorkUnits", () => {
        it("should return work units", async () => {
            mockIncomeService.findAllWorkUnits.mockResolvedValue([
                mockWorkUnit,
            ]);
            expect(await controller.findAllWorkUnits(mockRequest)).toEqual([
                mockWorkUnit,
            ]);
            expect(service.findAllWorkUnits).toHaveBeenCalledWith("1");
        });
    });

    describe("updateWorkUnit", () => {
        it("should update work unit", async () => {
            const dto = { defaultPrice: 600 };
            mockIncomeService.updateWorkUnit.mockResolvedValue({
                ...mockWorkUnit,
                ...dto,
            });
            expect(
                await controller.updateWorkUnit(mockRequest, "unit-1", dto)
            ).toEqual({
                ...mockWorkUnit,
                ...dto,
            });
            expect(service.updateWorkUnit).toHaveBeenCalledWith(
                "1",
                "unit-1",
                dto
            );
        });
    });

    describe("deleteWorkUnit", () => {
        it("should delete work unit", async () => {
            mockIncomeService.deleteWorkUnit.mockResolvedValue(mockWorkUnit);
            expect(
                await controller.deleteWorkUnit(mockRequest, "unit-1")
            ).toEqual(mockWorkUnit);
            expect(service.deleteWorkUnit).toHaveBeenCalledWith("1", "unit-1");
        });
    });
});
