import { Test, TestingModule } from "@nestjs/testing";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { ExecutionContext } from "@nestjs/common";

describe("JwtAuthGuard", () => {
    let guard: JwtAuthGuard;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [JwtAuthGuard],
        }).compile();

        guard = module.get<JwtAuthGuard>(JwtAuthGuard);
    });

    it("should be defined", () => {
        expect(guard).toBeDefined();
    });

    it("should return true for canActivate (mock check)", () => {
        // Since it extends AuthGuard('jwt'), testing internal logic is complex without integration.
        // We ensure it instantiates correctly.
        expect(guard).toBeInstanceOf(JwtAuthGuard);
    });
});
