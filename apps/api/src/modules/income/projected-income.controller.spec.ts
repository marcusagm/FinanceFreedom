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

    const mockRequest = { user: { userId: "1" } };

    describe("create", () => {
        it("should create a projection", async () => {
            const dto = {
                workUnitId: "1",
                date: "2024-01-01",
                amount: 100,
            };
            await controller.create(mockRequest, dto);
            expect(service.create).toHaveBeenCalledWith("1", {
                workUnit: { connect: { id: "1" } },
                date: new Date("2024-01-01"),
                amount: 100,
                status: "PLANNED",
            });
        });
    });

    describe("findAll", () => {
        it("should find all by month", async () => {
            await controller.findAll(mockRequest, "2024-01");

            // Replicate controller date logic
            const date = new Date("2024-01-01T00:00:00");
            const startOfMonth = new Date(
                date.getFullYear(),
                date.getMonth(),
                1
            );
            const endOfMonth = new Date(
                date.getFullYear(),
                date.getMonth() + 1,
                0
            );

            expect(service.findAll).toHaveBeenCalledWith(
                "1",
                startOfMonth,
                endOfMonth
            );
        });
    });
});
