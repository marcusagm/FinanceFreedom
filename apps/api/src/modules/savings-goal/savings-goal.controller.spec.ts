import { Test, TestingModule } from "@nestjs/testing";
import { SavingsGoalController } from "./savings-goal.controller";
import { SavingsGoalService } from "./savings-goal.service";
import { CreateSavingsGoalDto } from "./dto/create-savings-goal.dto";

describe("SavingsGoalController", () => {
    let controller: SavingsGoalController;
    let service: SavingsGoalService;

    const mockService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    const req = { user: { userId: "user-1" } };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SavingsGoalController],
            providers: [{ provide: SavingsGoalService, useValue: mockService }],
        }).compile();

        controller = module.get<SavingsGoalController>(SavingsGoalController);
        service = module.get<SavingsGoalService>(SavingsGoalService);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("create", () => {
        it("should create a savings goal", async () => {
            const dto: CreateSavingsGoalDto = {
                name: "Goal",
                targetAmount: 1000,
                targetDate: new Date(),
                currentAmount: 0,
                priority: 1,
            };
            const result = { id: "1", ...dto };
            mockService.create.mockResolvedValue(result);

            expect(await controller.create(req, dto)).toBe(result);
            expect(mockService.create).toHaveBeenCalledWith(
                req.user.userId,
                dto
            );
        });
    });

    describe("findAll", () => {
        it("should return array of goals", async () => {
            const result = [{ id: "1", name: "Goal" }];
            mockService.findAll.mockResolvedValue(result);

            expect(await controller.findAll(req)).toBe(result);
            expect(mockService.findAll).toHaveBeenCalledWith(req.user.userId);
        });
    });

    describe("findOne", () => {
        it("should return a goal", async () => {
            const result = { id: "1", name: "Goal" };
            mockService.findOne.mockResolvedValue(result);

            expect(await controller.findOne(req, "1")).toBe(result);
            expect(mockService.findOne).toHaveBeenCalledWith(
                req.user.userId,
                "1"
            );
        });
    });

    describe("update", () => {
        it("should update a goal", async () => {
            const dto = { name: "Updated" };
            const result = { id: "1", name: "Updated" };
            mockService.update.mockResolvedValue(result);

            expect(await controller.update(req, "1", dto)).toBe(result);
            expect(mockService.update).toHaveBeenCalledWith(
                req.user.userId,
                "1",
                dto
            );
        });
    });

    describe("remove", () => {
        it("should remove a goal", async () => {
            const result = { id: "1", name: "Goal" };
            mockService.remove.mockResolvedValue(result);

            expect(await controller.remove(req, "1")).toBe(result);
            expect(mockService.remove).toHaveBeenCalledWith(
                req.user.userId,
                "1"
            );
        });
    });
});
