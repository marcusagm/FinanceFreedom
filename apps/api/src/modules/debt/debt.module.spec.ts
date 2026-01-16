import { Test, TestingModule } from "@nestjs/testing";
import { DebtModule } from "./debt.module";
import { DebtService } from "./debt.service";
import { PrismaService } from "../../prisma/prisma.service";

describe("DebtModule", () => {
    let module: TestingModule;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            imports: [DebtModule],
        })
            .useMocker((token) => {
                if (token === PrismaService) {
                    return {};
                }
            })
            .compile();
    });

    it("should be defined", () => {
        expect(module).toBeDefined();
    });

    it("should provide DebtService", () => {
        const service = module.get<DebtService>(DebtService);
        expect(service).toBeDefined();
    });
});
