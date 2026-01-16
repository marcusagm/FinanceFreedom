import { Test, TestingModule } from "@nestjs/testing";
import { DashboardModule } from "./dashboard.module";
import { DashboardService } from "./dashboard.service";
import { PrismaService } from "../../prisma/prisma.service";

describe("DashboardModule", () => {
    let module: TestingModule;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            imports: [DashboardModule],
        })
            .overrideProvider(PrismaService)
            .useValue({})
            .compile();
    });

    it("should be defined", () => {
        expect(module).toBeDefined();
    });

    it("should provide DashboardService", () => {
        const service = module.get<DashboardService>(DashboardService);
        expect(service).toBeDefined();
    });
});
