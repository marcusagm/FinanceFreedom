import { Test, TestingModule } from "@nestjs/testing";
import { ImportModule } from "./import.module";
import { ImportService } from "./import.service";
import { PrismaService } from "../../prisma/prisma.service";
import { getQueueToken } from "@nestjs/bullmq";

describe("ImportModule", () => {
    let module: TestingModule;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            imports: [ImportModule],
        })
            .overrideProvider(PrismaService)
            .useValue({})
            .overrideProvider(getQueueToken("import-queue"))
            .useValue({ add: jest.fn() })
            .useMocker((token) => {
                if (typeof token === "function") {
                    // Mock all classes (Services, etc)
                    return {
                        create: jest.fn(),
                        findAll: jest.fn(),
                    };
                }
            })
            .compile();
    });

    it("should be defined", () => {
        expect(module).toBeDefined();
    });

    it("should provide ImportService", () => {
        const service = module.get<ImportService>(ImportService);
        expect(service).toBeDefined();
    });
});
