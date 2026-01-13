import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { PrismaService } from "../../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { MailService } from "../mail/mail.service";
import {
    ConflictException,
    UnauthorizedException,
    NotFoundException,
    BadRequestException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { randomBytes } from "crypto";

jest.mock("bcrypt");
jest.mock("crypto");

describe("AuthService", () => {
    let service: AuthService;
    let prismaService: PrismaService;
    let jwtService: JwtService;
    let mailService: MailService;

    const mockPrismaService = {
        user: {
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            findFirst: jest.fn(),
        },
    };

    const mockJwtService = {
        sign: jest.fn(),
    };

    const mockMailService = {
        sendPasswordResetEmail: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: PrismaService, useValue: mockPrismaService },
                { provide: JwtService, useValue: mockJwtService },
                { provide: MailService, useValue: mockMailService },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        prismaService = module.get<PrismaService>(PrismaService);
        jwtService = module.get<JwtService>(JwtService);
        mailService = module.get<MailService>(MailService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("validateUser", () => {
        it("should return null if user not found", async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(null);
            expect(
                await service.validateUser("test@test.com", "pass")
            ).toBeNull();
        });

        it("should return null if password incorrect", async () => {
            const user = { email: "test@test.com", passwordHash: "hash" };
            mockPrismaService.user.findUnique.mockResolvedValue(user);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            expect(
                await service.validateUser("test@test.com", "pass")
            ).toBeNull();
        });

        it("should return user without password if valid", async () => {
            const user = {
                email: "test@test.com",
                passwordHash: "hash",
                name: "Test",
            };
            mockPrismaService.user.findUnique.mockResolvedValue(user);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            const result = await service.validateUser("test@test.com", "pass");
            expect(result).toEqual({ email: "test@test.com", name: "Test" });
        });
    });

    describe("login", () => {
        it("should return access token", async () => {
            const user = { id: "1", email: "test@test.com", name: "Test" };
            mockJwtService.sign.mockReturnValue("token");

            const result = await service.login(user);

            expect(result).toEqual({
                access_token: "token",
                user: { id: "1", email: "test@test.com", name: "Test" },
            });
            expect(mockJwtService.sign).toHaveBeenCalledWith({
                email: "test@test.com",
                sub: "1",
            });
        });
    });

    describe("register", () => {
        it("should throw ConflictException if email exists", async () => {
            mockPrismaService.user.findUnique.mockResolvedValue({ id: "1" });
            const dto = {
                email: "test@test.com",
                password: "pass",
                name: "Test",
            };

            await expect(service.register(dto)).rejects.toThrow(
                ConflictException
            );
        });

        it("should create user and return without password", async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(null);
            (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPass");
            const dto = {
                email: "test@test.com",
                password: "pass",
                name: "Test",
            };
            const createdUser = {
                id: "1",
                email: dto.email,
                name: dto.name,
                passwordHash: "hashedPass",
            };

            mockPrismaService.user.create.mockResolvedValue(createdUser);

            const result = await service.register(dto);

            expect(result).toEqual({
                id: "1",
                email: "test@test.com",
                name: "Test",
            });
            expect(mockPrismaService.user.create).toHaveBeenCalledWith({
                data: {
                    email: "test@test.com",
                    name: "Test",
                    passwordHash: "hashedPass",
                },
            });
        });
    });

    describe("updateProfile", () => {
        it("should throw ConflictException if new email is taken", async () => {
            const dto = { email: "taken@test.com" };
            mockPrismaService.user.findUnique.mockResolvedValue({ id: "2" });

            await expect(service.updateProfile("1", dto)).rejects.toThrow(
                ConflictException
            );
        });

        it("should update profile", async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(null);
            mockPrismaService.user.update.mockResolvedValue({
                id: "1",
                email: "new@test.com",
                passwordHash: "hash",
            });

            const result = await service.updateProfile("1", {
                email: "new@test.com",
            });
            expect(result).toEqual({ id: "1", email: "new@test.com" });
        });
    });

    describe("changePassword", () => {
        it("should throw NotFoundException if user missing", async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(null);
            await expect(
                service.changePassword("1", {
                    currentPassword: "old",
                    newPassword: "new",
                })
            ).rejects.toThrow(NotFoundException);
        });

        it("should throw UnauthorizedException if current pass invalid", async () => {
            mockPrismaService.user.findUnique.mockResolvedValue({
                passwordHash: "hash",
            });
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(
                service.changePassword("1", {
                    currentPassword: "wrong",
                    newPassword: "new",
                })
            ).rejects.toThrow(UnauthorizedException);
        });

        it("should update password hash", async () => {
            mockPrismaService.user.findUnique.mockResolvedValue({
                id: "1",
                passwordHash: "hash",
            });
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (bcrypt.hash as jest.Mock).mockResolvedValue("newHash");

            await service.changePassword("1", {
                currentPassword: "old",
                newPassword: "new",
            });

            expect(mockPrismaService.user.update).toHaveBeenCalledWith({
                where: { id: "1" },
                data: { passwordHash: "newHash" },
            });
        });
    });

    describe("forgotPassword", () => {
        it("should return generic message if user not found", async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(null);
            const res = await service.forgotPassword("unknown@test.com");
            expect(res.message).toContain("If an account exists");
        });

        it("should generate token and send email", async () => {
            mockPrismaService.user.findUnique.mockResolvedValue({ id: "1" });
            (randomBytes as jest.Mock).mockReturnValue({
                toString: () => "token",
            });

            await service.forgotPassword("test@test.com");

            expect(mockPrismaService.user.update).toHaveBeenCalledWith({
                where: { id: "1" },
                data: expect.objectContaining({
                    resetToken: "token",
                    resetTokenExpiry: expect.any(Date),
                }),
            });
            expect(mockMailService.sendPasswordResetEmail).toHaveBeenCalledWith(
                "test@test.com",
                "token"
            );
        });
    });

    describe("resetPassword", () => {
        it("should throw BadRequestException if token invalid", async () => {
            mockPrismaService.user.findFirst.mockResolvedValue(null);
            await expect(
                service.resetPassword("badToken", "newPass")
            ).rejects.toThrow(BadRequestException);
        });

        it("should reset password and clear token", async () => {
            mockPrismaService.user.findFirst.mockResolvedValue({ id: "1" });
            (bcrypt.hash as jest.Mock).mockResolvedValue("newHash");

            await service.resetPassword("validToken", "newPass");

            expect(mockPrismaService.user.update).toHaveBeenCalledWith({
                where: { id: "1" },
                data: {
                    passwordHash: "newHash",
                    resetToken: null,
                    resetTokenExpiry: null,
                },
            });
        });
    });
});
