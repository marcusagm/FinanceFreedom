import { Test, TestingModule } from "@nestjs/testing";
import { FixedExpenseService } from "./fixed-expense.service";
import { PrismaService } from "../../prisma/prisma.service";

describe("FixedExpenseService", () => {
    let service: FixedExpenseService;
    let prisma: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FixedExpenseService,
                {
                    provide: PrismaService,
                    useValue: {
                        fixedExpense: {
                            create: jest.fn(),
                            findMany: jest.fn(),
                            findFirst: jest.fn(),
                            update: jest.fn(),
                            delete: jest.fn(),
                        },
                    },
                },
            ],
        }).compile();

        service = module.get<FixedExpenseService>(FixedExpenseService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    it("should create a fixed expense", async () => {
        const dto = {
            description: "Rent",
            amount: 2000,
            dueDay: 10,
            autoCreate: true,
            categoryId: "cat1",
            accountId: "acc1",
        };
        (prisma.fixedExpense.create as jest.Mock).mockResolvedValue({
            id: "1",
            ...dto,
            userId: "user1",
        });

        const result = await service.create("user1", dto);
        expect(result).toHaveProperty("id");
        expect(prisma.fixedExpense.create).toHaveBeenCalled();
    });

    it("should find all fixed expenses", async () => {
        (prisma.fixedExpense.findMany as jest.Mock).mockResolvedValue([]);
        await service.findAll("user1");
        expect(prisma.fixedExpense.findMany).toHaveBeenCalledWith({
            where: { userId: "user1" },
            include: { category: true, account: true },
        });
    });
});
