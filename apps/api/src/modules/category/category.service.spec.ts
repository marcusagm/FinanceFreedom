import { Test, TestingModule } from "@nestjs/testing";
import { CategoryService } from "./category.service";
import { PrismaService } from "../../prisma/prisma.service";
import { NotFoundException } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

const mockPrismaService = {
    category: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
};

describe("CategoryService", () => {
    let service: CategoryService;
    let prisma: typeof mockPrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CategoryService,
                { provide: PrismaService, useValue: mockPrismaService },
            ],
        }).compile();

        service = module.get<CategoryService>(CategoryService);
        prisma = module.get(PrismaService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("create", () => {
        it("should create a category", async () => {
            const userId = "user-1";
            const dto: CreateCategoryDto = {
                name: "Test Category",
                icon: "icon",
                color: "color",
            };
            const expectedResult = { id: "cat-1", ...dto, userId };

            prisma.category.create.mockResolvedValue(expectedResult);

            const result = await service.create(userId, dto);
            expect(result).toEqual(expectedResult);
            expect(prisma.category.create).toHaveBeenCalledWith({
                data: { ...dto, userId },
            });
        });
    });

    describe("findAll", () => {
        it("should return an array of categories", async () => {
            const userId = "user-1";
            const expectedResult = [{ id: "cat-1", name: "Test", userId }];

            prisma.category.findMany.mockResolvedValue(expectedResult);

            const result = await service.findAll(userId);
            expect(result).toEqual(expectedResult);
            expect(prisma.category.findMany).toHaveBeenCalledWith({
                where: { userId },
                orderBy: { name: "asc" },
            });
        });
    });

    describe("findOne", () => {
        it("should return a category if found", async () => {
            const userId = "user-1";
            const id = "cat-1";
            const expectedResult = { id, userId, name: "Test" };

            prisma.category.findFirst.mockResolvedValue(expectedResult);

            const result = await service.findOne(userId, id);
            expect(result).toEqual(expectedResult);
            expect(prisma.category.findFirst).toHaveBeenCalledWith({
                where: { id, userId },
            });
        });

        it("should throw NotFoundException if not found", async () => {
            prisma.category.findFirst.mockResolvedValue(null);

            await expect(service.findOne("user-1", "cat-999")).rejects.toThrow(
                NotFoundException
            );
        });
    });

    describe("update", () => {
        it("should update a category", async () => {
            const userId = "user-1";
            const id = "cat-1";
            const dto: UpdateCategoryDto = { name: "Updated" };
            const expectedResult = { id, userId, ...dto };

            // Mock findOne for existing category
            prisma.category.findFirst.mockResolvedValue({
                id,
                userId,
                name: "Old",
            });
            prisma.category.update.mockResolvedValue(expectedResult);

            const result = await service.update(userId, id, dto);
            expect(result).toEqual(expectedResult);
            expect(prisma.category.update).toHaveBeenCalledWith({
                where: { id },
                data: dto,
            });
        });

        it("should throw error if category to update is not found", async () => {
            prisma.category.findFirst.mockResolvedValue(null);
            await expect(
                service.update("user-1", "cat-999", {})
            ).rejects.toThrow(NotFoundException);
        });
    });

    describe("remove", () => {
        it("should remove a category", async () => {
            const userId = "user-1";
            const id = "cat-1";

            // Mock findOne
            prisma.category.findFirst.mockResolvedValue({
                id,
                userId,
                name: "Old",
            });
            prisma.category.delete.mockResolvedValue({
                id,
                userId,
                name: "Old",
            });

            await service.remove(userId, id);
            expect(prisma.category.delete).toHaveBeenCalledWith({
                where: { id },
            });
        });

        it("should throw error if category to remove is not found", async () => {
            prisma.category.findFirst.mockResolvedValue(null);
            await expect(service.remove("user-1", "cat-999")).rejects.toThrow(
                NotFoundException
            );
        });
    });
});
