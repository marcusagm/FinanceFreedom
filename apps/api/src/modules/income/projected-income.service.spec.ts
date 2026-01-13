import { Test, TestingModule } from "@nestjs/testing";
import { ProjectedIncomeService } from "./projected-income.service";
import { PrismaService } from "../../prisma/prisma.service";

const mockPrismaService = {
    projectedIncome: {
        create: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findFirstOrThrow: jest.fn(),
    },
    transaction: {
        create: jest.fn(),
        delete: jest.fn(),
    },
    account: {
        findMany: jest.fn(),
    },
    workUnit: {
        findFirst: jest.fn(),
    },
};

describe("ProjectedIncomeService", () => {
    let service: ProjectedIncomeService;
    let prisma: typeof mockPrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProjectedIncomeService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<ProjectedIncomeService>(ProjectedIncomeService);
        prisma = module.get(PrismaService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("create", () => {
        it("should create a projected income", async () => {
            const dto = {
                workUnit: { connect: { id: "1" } },
                date: new Date(),
                amount: 100,
                status: "PLANNED",
            };
            await service.create("user-1", dto as any);
            expect(prisma.projectedIncome.create).toHaveBeenCalledWith({
                data: { ...dto, user: { connect: { id: "user-1" } } },
                include: { workUnit: true },
            });
        });
    });

    describe("findAll", () => {
        it("should return projected incomes for a range", async () => {
            const start = new Date("2024-01-01");
            const end = new Date("2024-01-31");
            await service.findAll("user-1", start, end);
            expect(prisma.projectedIncome.findMany).toHaveBeenCalledWith({
                where: {
                    userId: "user-1",
                    date: {
                        gte: start,
                        lte: end,
                    },
                },
                include: { workUnit: true, transaction: true },
                orderBy: { date: "asc" },
            });
        });
    });

    it("should remove a projected income", async () => {
        await service.remove("user-1", "1");
        expect(prisma.projectedIncome.delete).toHaveBeenCalledWith({
            where: { id: "1" },
        });
    });
});

describe("update", () => {
    let service: ProjectedIncomeService;
    let prisma: typeof mockPrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProjectedIncomeService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<ProjectedIncomeService>(ProjectedIncomeService);
        prisma = module.get(PrismaService);

        // Reset all mocks before each test
        for (const key in mockPrismaService) {
            if (
                mockPrismaService[key] &&
                typeof mockPrismaService[key] === "object"
            ) {
                for (const method in mockPrismaService[key]) {
                    if (
                        typeof mockPrismaService[key][method] === "function" &&
                        mockPrismaService[key][method].mock
                    ) {
                        mockPrismaService[key][method].mockReset();
                    }
                }
            }
        }
    });

    it("should create a transaction when status is updated to PAID and no transaction exists", async () => {
        const mockProjectedIncome = {
            id: "1",
            amount: 100,
            date: new Date(),
            workUnit: { name: "Test Unit" },
            transactionId: null,
        };
        const mockAccount = { id: "acc1" };
        const mockTransaction = { id: "tx1" };

        // Mock findFirst (current state)
        prisma.projectedIncome.findFirst = jest
            .fn()
            .mockResolvedValue(mockProjectedIncome);

        // Mock update (result)
        prisma.projectedIncome.update = jest
            .fn()
            .mockResolvedValue(mockProjectedIncome);
        prisma.account.findMany = jest.fn().mockResolvedValue([mockAccount]);
        prisma.transaction.create = jest
            .fn()
            .mockResolvedValue(mockTransaction);

        await service.update("user-1", "1", { status: "PAID" });

        // Verify creation
        expect(prisma.transaction.create).toHaveBeenCalled();
        // Verify linking
        expect(prisma.projectedIncome.update).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { id: "1" },
                data: expect.objectContaining({
                    transactionId: "tx1",
                }),
            })
        );
    });

    it("should DELETE transaction when moving away from PAID", async () => {
        const mockProjectedIncome = {
            id: "1",
            amount: 100,
            date: new Date(),
            workUnit: { name: "Test Unit" },
            transactionId: "tx1", // Has existing transaction
        };

        // Mock findFirst instead of findUnique
        prisma.projectedIncome.findFirst = jest
            .fn()
            .mockResolvedValue(mockProjectedIncome);
        prisma.projectedIncome.update = jest
            .fn()
            .mockResolvedValue(mockProjectedIncome);
        prisma.transaction.delete = jest.fn().mockResolvedValue({});

        await service.update("user-1", "1", { status: "PLANNED" });

        expect(prisma.transaction.delete).toHaveBeenCalledWith({
            where: { id: "tx1" },
        });
    });

    it("should NOT create transaction if already PAID and has ID", async () => {
        const mockProjectedIncome = {
            id: "1",
            amount: 100,
            transactionId: "tx1",
        };

        // Mock findFirst
        prisma.projectedIncome.findFirst = jest
            .fn()
            .mockResolvedValue(mockProjectedIncome);
        prisma.projectedIncome.update = jest
            .fn()
            .mockResolvedValue(mockProjectedIncome);

        await service.update("user-1", "1", { status: "PAID" });

        expect(prisma.transaction.create).not.toHaveBeenCalled();
    });
});
