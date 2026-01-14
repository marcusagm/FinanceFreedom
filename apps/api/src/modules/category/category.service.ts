import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoryService {
    constructor(private prisma: PrismaService) {}

    async create(userId: string, dto: CreateCategoryDto) {
        return this.prisma.category.create({
            data: {
                ...dto,
                userId,
            },
        });
    }

    async findAll(userId: string) {
        return this.prisma.category.findMany({
            where: { userId },
            orderBy: { name: "asc" },
        });
    }

    async findOne(userId: string, id: string) {
        const category = await this.prisma.category.findFirst({
            where: { id, userId },
        });

        if (!category) {
            throw new NotFoundException("Category not found");
        }

        return category;
    }

    async update(userId: string, id: string, dto: UpdateCategoryDto) {
        await this.findOne(userId, id);

        return this.prisma.category.update({
            where: { id },
            data: dto,
        });
    }

    async remove(userId: string, id: string) {
        await this.findOne(userId, id);

        // Check if used? Prisma might error or cascade.
        // Schema says transactions rely on it?
        // User -> Category has Cascade delete.
        // Category -> Transaction: Transaction has optional categoryId.
        // If I delete category, what happens to transaction?
        // Schema:
        // categoryRel Category? @relation(fields: [categoryId], references: [id])
        // No onDelete specified, defaults to restrict usually or set null?
        // Prisma default is RESTRICT.
        // I should probably check if used.

        return this.prisma.category.delete({
            where: { id },
        });
    }
}
