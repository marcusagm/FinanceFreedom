import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Patch, // Changed from Put to Patch
    Request,
    UseGuards,
} from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"; // Updated import path

@Controller("categories") // Plural
@UseGuards(JwtAuthGuard)
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {} // Changed service to categoryService

    @Post()
    create(@Request() req: any, @Body() createDto: CreateCategoryDto) {
        // Added type for req
        return this.categoryService.create(req.user.userId, createDto); // Changed service to categoryService
    }

    @Get()
    findAll(@Request() req: any) {
        // Added type for req
        return this.categoryService.findAll(req.user.userId); // Changed service to categoryService
    }

    @Get(":id")
    findOne(@Request() req: any, @Param("id") id: string) {
        // Added type for req
        return this.categoryService.findOne(req.user.userId, id); // Changed service to categoryService
    }

    @Patch(":id") // Changed from Put to Patch
    update(
        @Request() req: any, // Added type for req
        @Param("id") id: string,
        @Body() updateDto: UpdateCategoryDto
    ) {
        return this.categoryService.update(req.user.userId, id, updateDto); // Changed service to categoryService
    }

    @Delete(":id")
    remove(@Request() req: any, @Param("id") id: string) {
        // Added type for req
        return this.categoryService.remove(req.user.userId, id);
    }
}
