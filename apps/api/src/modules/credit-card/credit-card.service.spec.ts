import { Test, TestingModule } from "@nestjs/testing";
import { CreditCardService } from "./credit-card.service";
import { PrismaService } from "../../prisma/prisma.service";
import { vi, describe, it, expect, beforeEach } from "vitest";

describe("CreditCardService", () => {
    let service: CreditCardService;
    let prisma: any;

    beforeEach(async () => {
        const mockPrismaService = {
            creditCard: {
                create: vi.fn(),
                findMany: vi.fn(),
                findFirst: vi.fn(),
                update: vi.fn(),
                delete: vi.fn(),
            },
            account: {
                create: vi.fn(),
            },
            transaction: {
                aggregate: vi.fn(),
                findMany: vi.fn(),
                create: vi.fn(),
            },
            $transaction: vi.fn((cb) => cb(mockPrismaService)),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CreditCardService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<CreditCardService>(CreditCardService);
        prisma = module.get<PrismaService>(PrismaService);
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

            prisma.account.create.mockResolvedValue({
                id: "acc1",
                balance: 0,
            });
            prisma.creditCard.create.mockResolvedValue({
                id: "card1",
                ...dto,
            });

            const result = await service.create(userId, dto);

            expect(prisma.account.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "CREDIT_CARD",
                    userId,
                }),
            );
            expect(prisma.creditCard.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    ...dto,
                    accountId: "acc1",
                }),
            );
        });
    });

    describe("calculateAvailableLimit", () => {
        it("should return limit + balance", async () => {
            const cardId = "card1";
            const userId = "user1";

            prisma.creditCard.findFirst.mockResolvedValue({
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
});
