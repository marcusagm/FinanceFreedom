import { Test, TestingModule } from "@nestjs/testing";
import { SmartMergerService } from "./smart-merger.service";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateTransactionDto } from "../transaction/dto/create-transaction.dto";

describe("SmartMergerService", () => {
    let service: SmartMergerService;
    let prisma: PrismaService;

    const mockPrisma = {
        transaction: {
            findMany: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SmartMergerService,
                { provide: PrismaService, useValue: mockPrisma },
            ],
        }).compile();

        service = module.get<SmartMergerService>(SmartMergerService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    it("should filter duplicates based on hash", async () => {
        const accountId = "acc1";
        const now = new Date();

        // Existing transaction in DB
        const existing = [
            {
                amount: { toNumber: () => -50.0 }, // Decimal mock
                date: now,
                description: "Supermarket",
            },
        ];

        mockPrisma.transaction.findMany.mockResolvedValue(existing);

        const incoming: CreateTransactionDto[] = [
            {
                amount: -50.0,
                date: now.toISOString(),
                description: "Supermarket",
                type: "EXPENSE",
                accountId,
                category: "Food",
            },
            {
                amount: -20.0,
                date: now.toISOString(),
                description: "Bakery",
                type: "EXPENSE",
                accountId,
                category: "Food",
            },
        ];

        const result = await service.filterDuplicates(
            "userId",
            accountId,
            incoming
        );

        expect(result).toHaveLength(1);
        expect(result[0].description).toBe("Bakery");
    });

    it("should return all if no duplicates", async () => {
        mockPrisma.transaction.findMany.mockResolvedValue([]);

        const incoming: CreateTransactionDto[] = [
            {
                amount: -50.0,
                date: new Date().toISOString(),
                description: "New trans",
                type: "EXPENSE",
                accountId: "acc1",
                category: "Food",
            },
        ];

        const result = await service.filterDuplicates(
            "userId",
            "acc1",
            incoming
        );
        expect(result).toHaveLength(1);
    });
});
