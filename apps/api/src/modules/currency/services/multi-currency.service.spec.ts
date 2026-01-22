import { Test, TestingModule } from "@nestjs/testing";
import { MultiCurrencyService } from "./multi-currency.service";
import { PrismaService } from "../../../prisma/prisma.service";
import { AwesomeApiProvider } from "../providers/awesome-api.provider";

describe("MultiCurrencyService", () => {
    let service: MultiCurrencyService;
    let prisma: PrismaService;
    let provider: AwesomeApiProvider;

    const mockPrisma = {
        exchangeRateCache: {
            findUnique: jest.fn(),
            create: jest.fn(),
        },
    };

    const mockProvider = {
        getRate: jest.fn(),
    };

    beforeEach(() => {
        service = new MultiCurrencyService(
            mockPrisma as any,
            mockProvider as any,
        );
        prisma = mockPrisma as any;
        provider = mockProvider as any;
        jest.clearAllMocks();
    });

    it("should return 1 for same currency", async () => {
        const rate = await service.getExchangeRate("USD", "USD", new Date());
        expect(rate).toBe(1);
    });

    it("should return cached rate if available", async () => {
        mockPrisma.exchangeRateCache.findUnique.mockResolvedValue({
            rate: 5.5,
        });

        const rate = await service.getExchangeRate("USD", "BRL", new Date());
        expect(rate).toBe(5.5);
        expect(provider.getRate).not.toHaveBeenCalled();
    });

    it("should fetch from provider and cache if not in cache", async () => {
        mockPrisma.exchangeRateCache.findUnique.mockResolvedValue(null);
        mockProvider.getRate.mockResolvedValue(5.2);

        // Using simple object/decimal check logic
        const rate = await service.getExchangeRate("USD", "BRL", new Date());
        expect(rate).toBe(5.2);
        expect(provider.getRate).toHaveBeenCalled();
        expect(prisma.exchangeRateCache.create).toHaveBeenCalled();
    });
});
