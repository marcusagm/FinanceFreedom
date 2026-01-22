import { Test, TestingModule } from "@nestjs/testing";
import { CreditCardService } from "./credit-card.service";
import { PrismaService } from "../../prisma/prisma.service";

describe("CreditCardService", () => {
    let service: CreditCardService;
    let prisma: any;

    const mockPrismaService = {
        creditCard: {
            create: jest.fn(),
            findMany: jest.fn(),
            findFirst: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        account: {
            create: jest.fn(),
        },
        transaction: {
            aggregate: jest.fn(),
            findMany: jest.fn(),
            create: jest.fn(),
        },
        $transaction: jest.fn((cb) => cb(mockPrismaService)),
    };

    beforeEach(async () => {
        // Manually instantiate to avoid DI issues in testing environment
        service = new CreditCardService(mockPrismaService as any);
        prisma = mockPrismaService;
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("create", () => {
        it("should create a credit card and a linked account", async () => {
            const dto = {
                name: "Nubank",
                brand: "Mastercard",
                limit: 1000,
                closingDay: 25,
                dueDay: 5,
            };
            const userId = "user1";

            mockPrismaService.account.create.mockResolvedValue({
                id: "acc1",
                balance: 0,
            });
            mockPrismaService.creditCard.create.mockResolvedValue({
                id: "card1",
                ...dto,
            });

            const result = await service.create(userId, dto);

            expect(mockPrismaService.account.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        type: "CREDIT_CARD",
                        userId,
                    }),
                }),
            );
            expect(mockPrismaService.creditCard.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        ...dto,
                        accountId: "acc1",
                    }),
                }),
            );
        });
    });

    describe("calculateAvailableLimit", () => {
        it("should return limit + balance", async () => {
            const cardId = "card1";
            const userId = "user1";

            mockPrismaService.creditCard.findFirst.mockResolvedValue({
                id: cardId,
                limit: 1000,
                account: { balance: -200 },
            });

            const result = await service.calculateAvailableLimit(
                userId,
                cardId,
            );
            expect(result).toBe(800);
        });
    });

    describe("getInvoice", () => {
        it("should return invoice data", async () => {
            const cardId = "card1";
            const userId = "user1";
            const month = 1;
            const year = 2024;

            mockPrismaService.creditCard.findFirst.mockResolvedValue({
                id: cardId,
                closingDay: 25,
                dueDay: 5,
                account: { id: "acc1" },
            });

            mockPrismaService.transaction.findMany.mockResolvedValue([
                {
                    id: "tx1",
                    amount: -100,
                    date: new Date("2024-01-10"),
                    type: "EXPENSE",
                },
            ]);

            const result = await service.getInvoice(
                userId,
                cardId,
                month,
                year,
            );
            expect(result).toBeDefined();
            expect(result.status).toBeDefined();
            expect(result.total).toBe(100);
        });
    });

    describe("payInvoice", () => {
        it("should process payment", async () => {
            const cardId = "card1";
            const userId = "user1";
            const accountId = "acc1";

            mockPrismaService.creditCard.findFirst.mockResolvedValue({
                id: cardId,
                closingDay: 25,
                dueDay: 5,
                account: { id: "cc-acc" },
                accountId: "cc-acc",
            });

            // Mock getInvoice indirectly by mocking finding transactions?
            // Since getInvoice relies on findMany, and we already mocked it for getInvoice test,
            // we should ensure it returns something positive for payInvoice to work.
            mockPrismaService.transaction.findMany.mockResolvedValue([
                { id: "tx1", amount: -100, date: new Date(), type: "EXPENSE" },
            ]);
            // amount -100 (EXPENSE) -> total 100.

            mockPrismaService.account.update = jest.fn();

            const result = await service.payInvoice(
                userId,
                cardId,
                1,
                2024,
                accountId,
            );

            expect(result.paid).toBe(true);
            expect(mockPrismaService.account.update).toHaveBeenCalledTimes(2);
        });
    });
});
