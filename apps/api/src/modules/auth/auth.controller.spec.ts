import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

describe("AuthController", () => {
    let controller: AuthController;
    let authService: AuthService;

    const mockAuthService = {
        login: jest.fn(),
        register: jest.fn(),
        updateProfile: jest.fn(),
        changePassword: jest.fn(),
        forgotPassword: jest.fn(),
        resetPassword: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("login", () => {
        it("should return login result", async () => {
            const req = { user: { username: "test" } };
            const loginDto = { email: "test@test.com", password: "pwd" };
            const result = { access_token: "token" };
            mockAuthService.login.mockResolvedValue(result);

            expect(await controller.login(req, loginDto)).toBe(result);
            expect(mockAuthService.login).toHaveBeenCalledWith(req.user);
        });
    });

    describe("register", () => {
        it("should register new user", async () => {
            const registerDto = {
                email: "test@test.com",
                password: "pwd",
                name: "Test",
            };
            const result = { id: "1", ...registerDto };
            mockAuthService.register.mockResolvedValue(result);

            expect(await controller.register(registerDto)).toBe(result);
            expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
        });
    });

    describe("getProfile", () => {
        it("should return user profile from request", () => {
            const req = { user: { id: "1", email: "test@test.com" } };
            expect(controller.getProfile(req)).toBe(req.user);
        });
    });

    describe("updateProfile", () => {
        it("should update profile", async () => {
            const req = { user: { userId: "1" } };
            const dto = { name: "New Name" };
            const result = { id: "1", ...dto };
            mockAuthService.updateProfile.mockResolvedValue(result);

            expect(await controller.updateProfile(req, dto)).toBe(result);
            expect(mockAuthService.updateProfile).toHaveBeenCalledWith(
                "1",
                dto
            );
        });
    });

    describe("changePassword", () => {
        it("should change password", async () => {
            const req = { user: { userId: "1" } };
            const dto = { oldPassword: "old", newPassword: "new" };
            mockAuthService.changePassword.mockResolvedValue(true);

            expect(await controller.changePassword(req, dto)).toBe(true);
            expect(mockAuthService.changePassword).toHaveBeenCalledWith(
                "1",
                dto
            );
        });
    });

    describe("forgotPassword", () => {
        it("should call forgotPassword service", async () => {
            const email = "test@test.com";
            mockAuthService.forgotPassword.mockResolvedValue(true);
            expect(await controller.forgotPassword(email)).toBe(true);
            expect(mockAuthService.forgotPassword).toHaveBeenCalledWith(email);
        });
    });

    describe("resetPassword", () => {
        it("should call resetPassword service", async () => {
            const token = "token";
            const newPassword = "new";
            mockAuthService.resetPassword.mockResolvedValue(true);
            expect(await controller.resetPassword(token, newPassword)).toBe(
                true
            );
            expect(mockAuthService.resetPassword).toHaveBeenCalledWith(
                token,
                newPassword
            );
        });
    });
});
