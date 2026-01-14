import { Test, TestingModule } from "@nestjs/testing";
import { SystemConfigService } from "./system-config.service";
import { PrismaService } from "../../prisma/prisma.service";

describe("SystemConfigService", () => {
    let service: SystemConfigService;
    let prisma: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SystemConfigService,
                {
                    provide: PrismaService,
                    useValue: {
                        systemConfig: {
                            findUnique: jest.fn(),
                            upsert: jest.fn(),
                            findMany: jest.fn(),
                        },
                    },
                },
            ],
        }).compile();

        service = module.get<SystemConfigService>(SystemConfigService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    it("should get a config", async () => {
        (prisma.systemConfig.findUnique as jest.Mock).mockResolvedValue({
            key: "foo",
            value: "bar",
            userId: "user1",
        });
        const result = await service.get("user1", "foo");
        expect(result).toBe("bar");
        expect(prisma.systemConfig.findUnique).toHaveBeenCalledWith({
            where: { key_userId: { key: "foo", userId: "user1" } },
        });
    });

    it("should return null if config not found", async () => {
        (prisma.systemConfig.findUnique as jest.Mock).mockResolvedValue(null);
        const result = await service.get("user1", "foo");
        expect(result).toBeNull();
    });

    it("should set a config", async () => {
        (prisma.systemConfig.upsert as jest.Mock).mockResolvedValue({
            key: "foo",
            value: "bar",
            userId: "user1",
        });
        const result = await service.set("user1", "foo", "bar");
        expect(result).toEqual({ key: "foo", value: "bar", userId: "user1" });
        expect(prisma.systemConfig.upsert).toHaveBeenCalled();
    });
});
