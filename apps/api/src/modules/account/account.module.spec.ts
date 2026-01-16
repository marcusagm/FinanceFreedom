import { Test, TestingModule } from "@nestjs/testing";
import { AccountModule } from "./account.module";
import { AccountService } from "./account.service";
import { AccountController } from "./account.controller";
import { PrismaService } from "../../prisma/prisma.service";

describe("AccountModule", () => {
    let module: TestingModule;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            imports: [AccountModule],
        })
            .useMocker((token) => {
                if (token === PrismaService) {
                    return {
                        // mock prisma
                    };
                }
            })
            .compile();
    });

    it("should be defined", () => {
        expect(module).toBeDefined();
    });

    it("should provide AccountService", () => {
        const service = module.get<AccountService>(AccountService);
        expect(service).toBeDefined();
    });

    it("should provide AccountController", () => {
        const controller = module.get<AccountController>(AccountController);
        expect(controller).toBeDefined();
    });
});
