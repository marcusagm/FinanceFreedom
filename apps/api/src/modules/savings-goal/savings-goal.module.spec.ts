import { Test, TestingModule } from "@nestjs/testing";
import { SavingsGoalModule } from "./savings-goal.module";
import { SavingsGoalService } from "./savings-goal.service";
import { PrismaService } from "../../prisma/prisma.service";

describe("SavingsGoalModule", () => {
    let module: TestingModule;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            imports: [SavingsGoalModule],
        })
            .useMocker((token) => {
                if (token === PrismaService) {
                    return {}; // Mock PrismaService
                }
            })
            .compile();
    });

    it("should be defined", () => {
        expect(module).toBeDefined();
    });

    it("should provide SavingsGoalService", () => {
        const service = module.get<SavingsGoalService>(SavingsGoalService);
        expect(service).toBeDefined();
    });
});
