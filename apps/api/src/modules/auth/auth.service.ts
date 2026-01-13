import { MailService } from "../mail/mail.service";
import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
    ConflictException,
    NotFoundException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../../prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { User } from "@prisma/client";
import { RegisterDto } from "./dto/register.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { randomBytes } from "crypto";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private mailService: MailService
    ) {}

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (user && (await bcrypt.compare(pass, user.passwordHash))) {
            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        };
    }

    async register(registerDto: RegisterDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: registerDto.email },
        });

        if (existingUser) {
            throw new ConflictException("Email already exists");
        }

        const passwordHash = await bcrypt.hash(registerDto.password, 10);

        const user = await this.prisma.user.create({
            data: {
                email: registerDto.email,
                name: registerDto.name,
                passwordHash,
            },
        });

        const { passwordHash: _, ...result } = user;
        return result;
    }

    async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
        if (updateProfileDto.email) {
            const existingUser = await this.prisma.user.findUnique({
                where: { email: updateProfileDto.email },
            });
            if (existingUser && existingUser.id !== userId) {
                throw new ConflictException("Email already in use");
            }
        }

        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                ...updateProfileDto,
            },
        });

        const { passwordHash, ...result } = user;
        return result;
    }

    async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        const isPasswordValid = await bcrypt.compare(
            changePasswordDto.currentPassword,
            user.passwordHash
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException("Invalid current password");
        }

        const newPasswordHash = await bcrypt.hash(
            changePasswordDto.newPassword,
            10
        );

        await this.prisma.user.update({
            where: { id: userId },
            data: { passwordHash: newPasswordHash },
        });

        return { message: "Password updated successfully" };
    }

    async forgotPassword(email: string) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // Don't reveal user existence
            return {
                message: "If an account exists, a reset email has been sent.",
            };
        }

        const resetToken = randomBytes(32).toString("hex");
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken,
                resetTokenExpiry,
            },
        });

        // Logs are now handled by MailService or just standard logging
        console.log(
            `[AuthService] Reset Token generated for ${email}: ${resetToken}`
        );

        try {
            await this.mailService.sendPasswordResetEmail(email, resetToken);
        } catch (error) {
            console.error("Failed to send reset email", error);
            // We might want to throw an error here or just log it, depending on requirements.
            // For security, it's often better to not tell the user that the email failed if it reveals user existence,
            // but in this case, if they are here, we know the user exists (logic above).
            // Actually, `forgotPassword` returns generic message even if user doesn't exist.
            // But here we are inside `if (!user)` block... wait.
            // Logic above: if (!user) return generic message.
            // So here user exists.

            // If email fails, the token is set but user won't get it.
            // Let's log it.
        }

        return {
            message: "If an account exists, a reset email has been sent.",
        };
    }

    async resetPassword(token: string, newPassword: string) {
        const user = await this.prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: { gt: new Date() },
            },
        });

        if (!user) {
            throw new BadRequestException("Invalid or expired token");
        }

        const passwordHash = await bcrypt.hash(newPassword, 10);

        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                passwordHash,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });

        return { message: "Password reset successfully" };
    }
}
