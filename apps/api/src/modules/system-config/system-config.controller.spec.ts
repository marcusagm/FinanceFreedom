import { Test, TestingModule } from "@nestjs/testing";
import { SystemConfigController } from "./system-config.controller";
import { SystemConfigService } from "./system-config.service";

describe("SystemConfigController", () => {
    let controller: SystemConfigController;
    let service: SystemConfigService;

    const mockService = {
        getAll: jest.fn(),
        get: jest.fn(),
        set: jest.fn(),
    };

    const req = { user: { userId: "user-1" } };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SystemConfigController],
            providers: [
                { provide: SystemConfigService, useValue: mockService },
            ],
        }).compile();

        controller = module.get<SystemConfigController>(SystemConfigController);
        service = module.get<SystemConfigService>(SystemConfigService);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("getAll", () => {
        it("should return all configs", async () => {
            const configs = { theme: "dark" };
            mockService.getAll.mockResolvedValue(configs);

            expect(await controller.getAll(req)).toBe(configs);
            expect(mockService.getAll).toHaveBeenCalledWith(req.user.userId);
        });
    });

    describe("get", () => {
        it("should return a specific config", async () => {
            const result = "dark";
            mockService.get.mockResolvedValue(result);

            expect(await controller.get(req, "theme")).toBe(result);
            expect(mockService.get).toHaveBeenCalledWith(
                req.user.userId,
                "theme"
            );
        });
    });

    describe("set", () => {
        it("should set a config", async () => {
            const result = { key: "theme", value: "light" };
            mockService.set.mockResolvedValue(result);

            expect(await controller.set(req, "theme", "light")).toBe(result);
            expect(mockService.set).toHaveBeenCalledWith(
                req.user.userId,
                "theme",
                "light"
            );
        });
    });

    describe("setMany", () => {
        it("should set multiple configs and return all", async () => {
            const body = { theme: "light", lang: "en" };
            const finalConfigs = { theme: "light", lang: "en" };

            mockService.set.mockResolvedValue(true);
            mockService.getAll.mockResolvedValue(finalConfigs);

            expect(await controller.setMany(req, body)).toBe(finalConfigs);
            // set is called twice
            expect(mockService.set).toHaveBeenCalledWith(
                "user-1",
                "theme",
                "light"
            );
            expect(mockService.set).toHaveBeenCalledWith(
                "user-1",
                "lang",
                "en"
            );
            expect(mockService.getAll).toHaveBeenCalledWith("user-1");
        });
    });
});
