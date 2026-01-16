import { Test, TestingModule } from "@nestjs/testing";
import { FixedExpenseController } from "./fixed-expense.controller";
import { FixedExpenseService } from "./fixed-expense.service";
import { CreateFixedExpenseDto } from "./dto/create-fixed-expense.dto";
import { UpdateFixedExpenseDto } from "./dto/update-fixed-expense.dto";

describe("FixedExpenseController", () => {
    let controller: FixedExpenseController;
    let service: FixedExpenseService;

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
            controllers: [FixedExpenseController],
            providers: [
                { provide: FixedExpenseService, useValue: mockService },
            ],
        }).compile();

        controller = module.get<FixedExpenseController>(FixedExpenseController);
        service = module.get<FixedExpenseService>(FixedExpenseService);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("create", () => {
        it("should create a fixed expense", async () => {
            const dto: CreateFixedExpenseDto = {
                description: "Rent",
                amount: 1000,
                dueDay: 5,
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
        it("should return an array of fixed expenses", async () => {
            const result = [{ id: "1", description: "Rent" }];
            mockService.findAll.mockResolvedValue(result);

            expect(await controller.findAll(req)).toBe(result);
            expect(mockService.findAll).toHaveBeenCalledWith(req.user.userId);
        });
    });

    describe("findOne", () => {
        it("should return a single fixed expense", async () => {
            const result = { id: "1", description: "Rent" };
            mockService.findOne.mockResolvedValue(result);

            expect(await controller.findOne(req, "1")).toBe(result);
            expect(mockService.findOne).toHaveBeenCalledWith(
                req.user.userId,
                "1"
            );
        });
    });

    describe("update", () => {
        it("should update a fixed expense", async () => {
            const dto: UpdateFixedExpenseDto = { amount: 1200 };
            const result = { id: "1", description: "Rent", amount: 1200 };
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
        it("should remove a fixed expense", async () => {
            const result = { id: "1", description: "Rent" };
            mockService.remove.mockResolvedValue(result);

            expect(await controller.remove(req, "1")).toBe(result);
            expect(mockService.remove).toHaveBeenCalledWith(
                req.user.userId,
                "1"
            );
        });
    });
});
