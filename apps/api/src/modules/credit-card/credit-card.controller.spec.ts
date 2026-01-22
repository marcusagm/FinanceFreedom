import { Test, TestingModule } from "@nestjs/testing";
import { CreditCardController } from "./credit-card.controller";
import { CreditCardService } from "./credit-card.service";
import { CreateCreditCardDto } from "./dto/credit-card.dto";
import { UpdateCreditCardDto } from "./dto/credit-card.dto";

describe("CreditCardController", () => {
    let controller: CreditCardController;
    let service: CreditCardService;

    const mockService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
        getInvoice: jest.fn(),
        payInvoice: jest.fn(),
    };

    beforeEach(async () => {
        // Manually instantiate to insure injection
        // This bypasses NestJS testing module if needed for unit testing isolation
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CreditCardController],
            providers: [
                {
                    provide: CreditCardService,
                    useValue: mockService,
                },
            ],
        }).compile();

        // controller = module.get<CreditCardController>(CreditCardController);
        controller = new CreditCardController(mockService as any);
        service = module.get<CreditCardService>(CreditCardService);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("create", () => {
        it("should call service.create", async () => {
            const dto: CreateCreditCardDto = {
                name: "Test Card",
                brand: "Visa",
                limit: 1000,
                closingDay: 1,
                dueDay: 10,
            };
            const req = { user: { userId: "user1" } };
            await controller.create(dto, req);
            expect(service.create).toHaveBeenCalledWith("user1", dto);
        });
    });

    describe("findAll", () => {
        it("should call service.findAll", async () => {
            const req = { user: { userId: "user1" } };
            await controller.findAll(req);
            expect(service.findAll).toHaveBeenCalledWith("user1");
        });
    });

    describe("getInvoice", () => {
        it("should call service.getInvoice", async () => {
            const req = { user: { userId: "user1" } };
            const query = { month: 1, year: 2024 };
            await controller.getInvoice("card1", query.month, query.year, req);
            expect(service.getInvoice).toHaveBeenCalledWith(
                "user1",
                "card1",
                1,
                2024,
            );
        });
    });

    describe("payInvoice", () => {
        it("should call service.payInvoice", async () => {
            const req = { user: { userId: "user1" } };
            const body = { month: 1, year: 2024, accountId: "acc1" };
            await controller.payInvoice(req, "card1", body);
            expect(service.payInvoice).toHaveBeenCalledWith(
                "user1",
                "card1",
                1,
                2024,
                "acc1",
            );
        });
    });
});
