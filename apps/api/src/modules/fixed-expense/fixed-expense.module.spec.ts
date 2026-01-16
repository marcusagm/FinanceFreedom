import { Test, TestingModule } from "@nestjs/testing";
import { FixedExpenseModule } from "./fixed-expense.module";
import { FixedExpenseService } from "./fixed-expense.service";
import { PrismaService } from "../../prisma/prisma.service";

describe("FixedExpenseModule", () => {
    let module: TestingModule;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            imports: [FixedExpenseModule],
        })
            .overrideProvider(PrismaService)
            .useValue({})
            .compile();
    });

    it("should be defined", () => {
        expect(module).toBeDefined();
    });

    it("should provide FixedExpenseService", () => {
        const service = module.get<FixedExpenseService>(FixedExpenseService);
        expect(service).toBeDefined();
    });
});
