import { Test, TestingModule } from "@nestjs/testing";
import { AccountService } from "./account.service";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateAccountDto } from "./dto/create-account.dto";

const mockPrismaService = {
    account: {
        create: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
};

describe("AccountService", () => {
    let service: AccountService;
    let prisma: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AccountService,
                { provide: PrismaService, useValue: mockPrismaService },
            ],
        }).compile();

        service = module.get<AccountService>(AccountService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("create", () => {
        it("should create a new account", async () => {
            const dto: CreateAccountDto = {
                name: "Test Account",
                type: "WALLET",
                balance: 100,
            };
            const expectedResult = { id: "1", ...dto, createdAt: new Date() };

            (prisma.account.create as jest.Mock).mockResolvedValue(
                expectedResult
            );

            const result = await service.create("1", dto);
            expect(result).toEqual(expectedResult);
            // eslint-disable-next-line @typescript-eslint/unbound-method
            expect(prisma.account.create).toHaveBeenCalledWith({
                data: { ...dto, userId: "1" },
            });
        });
    });

    describe("findAll", () => {
        it("should return an array of accounts", async () => {
            const expectedResult = [{ id: "1", name: "Test", balance: 100 }];
            (prisma.account.findMany as jest.Mock).mockResolvedValue(
                expectedResult
            );

            const result = await service.findAll("1");
            expect(result).toEqual(expectedResult);
            // eslint-disable-next-line @typescript-eslint/unbound-method
            expect(prisma.account.findMany).toHaveBeenCalledWith({
                where: { userId: "1" },
                orderBy: { createdAt: "desc" },
            });
        });
    });
});
