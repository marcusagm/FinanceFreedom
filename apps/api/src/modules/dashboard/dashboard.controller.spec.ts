import { Test, TestingModule } from "@nestjs/testing";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";

describe("DashboardController", () => {
    let controller: DashboardController;
    let service: DashboardService;

    const mockDashboardService = {
        getSummary: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [DashboardController],
            providers: [
                {
                    provide: DashboardService,
                    useValue: mockDashboardService,
                },
            ],
        }).compile();

        controller = module.get<DashboardController>(DashboardController);
        service = module.get<DashboardService>(DashboardService);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("getSummary", () => {
        it("should return dashboard summary", async () => {
            const req = { user: { userId: "user-123" } };
            const result = { totalBudget: 1000, spent: 500 };
            mockDashboardService.getSummary.mockResolvedValue(result);

            expect(await controller.getSummary(req)).toBe(result);
            expect(mockDashboardService.getSummary).toHaveBeenCalledWith(
                "user-123"
            );
        });
    });
});
