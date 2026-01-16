import { Test, TestingModule } from "@nestjs/testing";
import { DebtController } from "./debt.controller";
import { DebtService } from "./debt.service";

describe("DebtController", () => {
    let controller: DebtController;
    let service: DebtService;

    const mockDebtService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
        getSortedDebts: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [DebtController],
            providers: [
                {
                    provide: DebtService,
                    useValue: mockDebtService,
                },
            ],
        }).compile();

        controller = module.get<DebtController>(DebtController);
        service = module.get<DebtService>(DebtService);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("create", () => {
        it("should create a debt", async () => {
            const req = { user: { userId: "user-123" } };
            const dto = { name: "Debt 1", amount: 1000 };
            const result = { id: "1", ...dto };
            mockDebtService.create.mockResolvedValue(result);

            expect(await controller.create(req, dto as any)).toBe(result);
            expect(mockDebtService.create).toHaveBeenCalledWith(
                "user-123",
                dto
            );
        });
    });

    describe("findAll", () => {
        it("should return all debts", async () => {
            const req = { user: { userId: "user-123" } };
            const result = [{ id: "1", name: "Debt 1" }];
            mockDebtService.findAll.mockResolvedValue(result);

            expect(await controller.findAll(req)).toBe(result);
            expect(mockDebtService.findAll).toHaveBeenCalledWith("user-123");
        });
    });

    describe("getStrategy", () => {
        it("should return sorted debts with strategy", async () => {
            const req = { user: { userId: "user-123" } };
            const type = "SNOWBALL";
            const monthlyExtra = "100";
            const result = [{ id: "1" }];
            mockDebtService.getSortedDebts.mockResolvedValue(result);

            expect(await controller.getStrategy(req, type, monthlyExtra)).toBe(
                result
            );
            expect(mockDebtService.getSortedDebts).toHaveBeenCalledWith(
                "user-123",
                type,
                100
            );
        });
    });

    describe("findOne", () => {
        it("should return one debt", async () => {
            const req = { user: { userId: "user-123" } };
            const result = { id: "1" };
            mockDebtService.findOne.mockResolvedValue(result);

            expect(await controller.findOne(req, "1")).toBe(result);
            expect(mockDebtService.findOne).toHaveBeenCalledWith(
                "user-123",
                "1"
            );
        });
    });

    describe("update", () => {
        it("should update a debt", async () => {
            const req = { user: { userId: "user-123" } };
            const dto = { name: "Updated" };
            const result = { id: "1", ...dto };
            mockDebtService.update.mockResolvedValue(result);

            expect(await controller.update(req, "1", dto)).toBe(result);
            expect(mockDebtService.update).toHaveBeenCalledWith(
                "user-123",
                "1",
                dto
            );
        });
    });

    describe("remove", () => {
        it("should remove a debt", async () => {
            const req = { user: { userId: "user-123" } };
            const result = { id: "1" };
            mockDebtService.remove.mockResolvedValue(result);

            expect(await controller.remove(req, "1")).toBe(result);
            expect(mockDebtService.remove).toHaveBeenCalledWith(
                "user-123",
                "1"
            );
        });
    });
});
