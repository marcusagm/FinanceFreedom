import { Test, TestingModule } from "@nestjs/testing";
import { AccountController } from "./account.controller";
import { AccountService } from "./account.service";

describe("AccountController", () => {
    let controller: AccountController;
    let service: AccountService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AccountController],
            providers: [
                {
                    provide: AccountService,
                    useValue: {
                        create: jest.fn(),
                        findAll: jest.fn(),
                        update: jest.fn(),
                        remove: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<AccountController>(AccountController);
        service = module.get<AccountService>(AccountService);
    });

    const mockRequest = { user: { userId: "1" } };

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    it("should call service.create", async () => {
        const dto: any = { name: "Test", type: "WALLET", balance: 0 };
        await controller.create(mockRequest, dto);
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(service.create).toHaveBeenCalledWith("1", dto);
    });

    it("should call service.findAll", async () => {
        await controller.findAll(mockRequest);
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(service.findAll).toHaveBeenCalledWith("1");
    });

    it("should call service.update", async () => {
        const dto: any = { name: "Updated", type: "BANK", balance: 100 };
        await controller.update(mockRequest, "1", dto);
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(service.update).toHaveBeenCalledWith("1", "1", dto);
    });

    it("should call service.remove", async () => {
        await controller.remove(mockRequest, "1");
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(service.remove).toHaveBeenCalledWith("1", "1");
    });
});
