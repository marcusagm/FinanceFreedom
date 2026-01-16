import { Test, TestingModule } from "@nestjs/testing";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";

describe("CategoryController", () => {
    let controller: CategoryController;
    let service: CategoryService;

    const mockCategoryService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CategoryController],
            providers: [
                {
                    provide: CategoryService,
                    useValue: mockCategoryService,
                },
            ],
        }).compile();

        controller = module.get<CategoryController>(CategoryController);
        service = module.get<CategoryService>(CategoryService);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("create", () => {
        it("should create a category", async () => {
            const req = { user: { userId: "user-1" } };
            const dto = {
                name: "Test",
                color: "red",
                type: "EXPENSE" as const,
            };
            const result = { id: "1", ...dto };
            mockCategoryService.create.mockResolvedValue(result);

            expect(await controller.create(req, dto)).toBe(result);
            expect(mockCategoryService.create).toHaveBeenCalledWith(
                "user-1",
                dto
            );
        });
    });

    describe("findAll", () => {
        it("should return all categories for user", async () => {
            const req = { user: { userId: "user-1" } };
            const result = [{ id: "1", name: "Test" }];
            mockCategoryService.findAll.mockResolvedValue(result);

            expect(await controller.findAll(req)).toBe(result);
            expect(mockCategoryService.findAll).toHaveBeenCalledWith("user-1");
        });
    });

    describe("findOne", () => {
        it("should return one category", async () => {
            const req = { user: { userId: "user-1" } };
            const result = { id: "1", name: "Test" };
            mockCategoryService.findOne.mockResolvedValue(result);

            expect(await controller.findOne(req, "1")).toBe(result);
            expect(mockCategoryService.findOne).toHaveBeenCalledWith(
                "user-1",
                "1"
            );
        });
    });

    describe("update", () => {
        it("should update a category", async () => {
            const req = { user: { userId: "user-1" } };
            const dto = { name: "Updated" };
            const result = { id: "1", ...dto };
            mockCategoryService.update.mockResolvedValue(result);

            expect(await controller.update(req, "1", dto)).toBe(result);
            expect(mockCategoryService.update).toHaveBeenCalledWith(
                "user-1",
                "1",
                dto
            );
        });
    });

    describe("remove", () => {
        it("should remove a category", async () => {
            const req = { user: { userId: "user-1" } };
            const result = { id: "1", name: "Deleted" };
            mockCategoryService.remove.mockResolvedValue(result);

            expect(await controller.remove(req, "1")).toBe(result);
            expect(mockCategoryService.remove).toHaveBeenCalledWith(
                "user-1",
                "1"
            );
        });
    });
});
