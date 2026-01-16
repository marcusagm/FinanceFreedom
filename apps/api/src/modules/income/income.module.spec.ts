import { Test, TestingModule } from "@nestjs/testing";
import { IncomeModule } from "./income.module";
import { IncomeService } from "./income.service";
import { PrismaService } from "../../prisma/prisma.service";

describe("IncomeModule", () => {
    let module: TestingModule;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            imports: [IncomeModule],
        })
            .overrideProvider(PrismaService)
            .useValue({})
            .compile();
    });

    it("should be defined", () => {
        expect(module).toBeDefined();
    });

    it("should provide IncomeService", () => {
        const service = module.get<IncomeService>(IncomeService);
        expect(service).toBeDefined();
    });
});
