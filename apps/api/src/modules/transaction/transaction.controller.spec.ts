import { Test, TestingModule } from "@nestjs/testing";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { TransactionController } from "./transaction.controller";
import { TransactionService } from "./transaction.service";

describe("TransactionController", () => {
    let controller: TransactionController;
    let service: TransactionService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TransactionController],
            providers: [
                {
                    provide: TransactionService,
                    useValue: {
                        create: vi.fn(),
                        findAll: vi.fn(),
                        findOne: vi.fn(),
                        update: vi.fn(),
                        remove: vi.fn(),
                        split: vi.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<TransactionController>(TransactionController);
        service = module.get<TransactionService>(TransactionService);
    });

    const mockRequest = { user: { userId: "1" } };

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    it("should call service.create", async () => {
        const dto: any = { description: "Test", amount: 100 };
        await controller.create(mockRequest, dto);
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(service.create).toHaveBeenCalledWith("1", dto);
    });

    it("should call service.findAll", async () => {
        const query: any = {};
        await controller.findAll(mockRequest, query);
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(service.findAll).toHaveBeenCalledWith("1", query);
    });

    it("should call service.findOne", async () => {
        await controller.findOne(mockRequest, "1");
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(service.findOne).toHaveBeenCalledWith("1", "1");
    });

    it("should call service.update", async () => {
        const dto: any = { amount: 200 };
        await controller.update(mockRequest, "1", dto);
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(service.update).toHaveBeenCalledWith("1", "1", dto);
    });

    it("should call service.remove", async () => {
        await controller.remove(mockRequest, "1");
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(service.remove).toHaveBeenCalledWith("1", "1");
    });

    it("should call service.split", async () => {
        const dto: any = { splits: [] };
        await controller.split(mockRequest, "1", dto);
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(service.split).toHaveBeenCalledWith("1", "1", dto);
    });
});
