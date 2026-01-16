import { Test, TestingModule } from "@nestjs/testing";
import { CategoryModule } from "./category.module";
import { CategoryService } from "./category.service";
import { PrismaService } from "../../prisma/prisma.service";

describe("CategoryModule", () => {
    let module: TestingModule;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            imports: [CategoryModule],
        })
            .overrideProvider(PrismaService)
            .useValue({})
            .compile();
    });

    it("should be defined", () => {
        expect(module).toBeDefined();
    });

    it("should provide CategoryService", () => {
        const service = module.get<CategoryService>(CategoryService);
        expect(service).toBeDefined();
    });
});
