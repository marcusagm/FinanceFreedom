import { Test, TestingModule } from "@nestjs/testing";
import { ProjectedIncomeService } from "./projected-income.service";
import { PrismaService } from "../../prisma/prisma.service";

const mockPrismaService = {
    projectedIncome: {
        create: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
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
            await service.create(dto as any);
            expect(prisma.projectedIncome.create).toHaveBeenCalledWith({
                data: dto,
                include: { workUnit: true },
            });
        });
    });

    describe("findAll", () => {
        it("should return projected incomes for a range", async () => {
            const start = new Date("2024-01-01");
            const end = new Date("2024-01-31");
            await service.findAll(start, end);
            expect(prisma.projectedIncome.findMany).toHaveBeenCalledWith({
                where: {
                    date: {
                        gte: start,
                        lte: end,
                    },
                },
                include: { workUnit: true },
                orderBy: { date: "asc" },
            });
        });
    });

    describe("remove", () => {
        it("should remove a projected income", async () => {
            await service.remove("1");
            expect(prisma.projectedIncome.delete).toHaveBeenCalledWith({
                where: { id: "1" },
            });
        });
    });
});
