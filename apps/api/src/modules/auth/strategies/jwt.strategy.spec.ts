import { Test, TestingModule } from "@nestjs/testing";
import { JwtStrategy } from "./jwt.strategy";
import { ConfigService } from "@nestjs/config";

describe("JwtStrategy", () => {
    let strategy: JwtStrategy;

    beforeEach(async () => {
        // Mock ConfigService if used in future
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                JwtStrategy,
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn().mockReturnValue("secretKey"),
                    },
                },
            ],
        }).compile();

        strategy = module.get<JwtStrategy>(JwtStrategy);
    });

    it("should be defined", () => {
        expect(strategy).toBeDefined();
    });

    it("should validate and return user payload", async () => {
        const payload = { sub: "user-1", email: "test@example.com" };
        const result = await strategy.validate(payload);
        expect(result).toEqual({ userId: "user-1", email: "test@example.com" });
    });
});
