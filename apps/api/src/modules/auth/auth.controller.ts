import {
    Controller,
    Post,
    UseGuards,
    Request,
    Body,
    Get,
    Put,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { Public } from "./guards/jwt-auth.guard";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post("login")
    async login(@Request() req: any, @Body() loginDto: LoginDto) {
        return this.authService.login(req.user);
    }

    @Get("profile")
    getProfile(@Request() req: any) {
        return req.user;
    }

    @Public()
    @Post("register")
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Put("profile")
    async updateProfile(
        @Request() req: any,
        @Body() updateProfileDto: UpdateProfileDto
    ) {
        return this.authService.updateProfile(
            req.user.userId,
            updateProfileDto
        );
    }

    @Put("password")
    async changePassword(
        @Request() req: any,
        @Body() changePasswordDto: ChangePasswordDto
    ) {
        return this.authService.changePassword(
            req.user.userId,
            changePasswordDto
        );
    }

    @Public()
    @Post("forgot-password")
    async forgotPassword(@Body("email") email: string) {
        return this.authService.forgotPassword(email);
    }

    @Public()
    @Post("reset-password")
    async resetPassword(
        @Body("token") token: string,
        @Body("newPassword") newPassword: string
    ) {
        return this.authService.resetPassword(token, newPassword);
    }
}
