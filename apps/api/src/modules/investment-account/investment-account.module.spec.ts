import { Test, TestingModule } from "@nestjs/testing";
import { InvestmentAccountModule } from "./investment-account.module";
import { InvestmentAccountService } from "./investment-account.service";
import { PrismaService } from "../../prisma/prisma.service";

describe("InvestmentAccountModule", () => {
    let module: TestingModule;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            imports: [InvestmentAccountModule],
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

    it("should provide InvestmentAccountService", () => {
        const service = module.get<InvestmentAccountService>(
            InvestmentAccountService
        );
        expect(service).toBeDefined();
    });
});
