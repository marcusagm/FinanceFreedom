import { Test, TestingModule } from "@nestjs/testing";
import { LocalStrategy } from "./local.strategy";
import { AuthService } from "../auth.service";
import { UnauthorizedException } from "@nestjs/common";

describe("LocalStrategy", () => {
    let strategy: LocalStrategy;
    let authService: AuthService;

    const mockAuthService = {
        validateUser: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LocalStrategy,
                { provide: AuthService, useValue: mockAuthService },
            ],
        }).compile();

        strategy = module.get<LocalStrategy>(LocalStrategy);
        authService = module.get<AuthService>(AuthService);
    });

    it("should be defined", () => {
        expect(strategy).toBeDefined();
    });

    it("should return user if validation is successful", async () => {
        const user = { id: "1", email: "test@test.com" };
        mockAuthService.validateUser.mockResolvedValue(user);

        const result = await strategy.validate("test@test.com", "password");
        expect(result).toEqual(user);
        expect(authService.validateUser).toHaveBeenCalledWith(
            "test@test.com",
            "password"
        );
    });

    it("should throw UnauthorizedException if validation fails", async () => {
        mockAuthService.validateUser.mockResolvedValue(null);

        await expect(
            strategy.validate("test@test.com", "wrong")
        ).rejects.toThrow(UnauthorizedException);
    });
});
