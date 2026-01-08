import { Test, TestingModule } from "@nestjs/testing";
import { ProjectedIncomeController } from "./projected-income.controller";
import { ProjectedIncomeService } from "./projected-income.service";

const mockProjectedIncomeService = {
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
};

describe("ProjectedIncomeController", () => {
    let controller: ProjectedIncomeController;
    let service: typeof mockProjectedIncomeService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProjectedIncomeController],
            providers: [
                {
                    provide: ProjectedIncomeService,
                    useValue: mockProjectedIncomeService,
                },
            ],
        }).compile();

        controller = module.get<ProjectedIncomeController>(
            ProjectedIncomeController
        );
        service = module.get(ProjectedIncomeService);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("create", () => {
        it("should create a projection", async () => {
            const dto = {
                workUnitId: "1",
                date: "2024-01-01",
                amount: 100,
            };
            await controller.create(dto);
            expect(service.create).toHaveBeenCalled();
        });
    });

    describe("findAll", () => {
        it("should find all by month", async () => {
            await controller.findAll("2024-01");
            expect(service.findAll).toHaveBeenCalled();
        });
    });
});
