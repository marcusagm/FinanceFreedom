import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MailService {
    private transporter;
    private fromEmail;

    constructor(private configService: ConfigService) {
        this.fromEmail =
            this.configService.get<string>("SMTP_FROM") ||
            '"No Reply" <noreply@example.com>';

        this.transporter = nodemailer.createTransport({
            host: this.configService.get<string>("SMTP_HOST"),
            port: this.configService.get<number>("SMTP_PORT"),
            secure: this.configService.get<number>("SMTP_PORT") === 465,
            auth: {
                user: this.configService.get<string>("SMTP_USER"),
                pass: this.configService.get<string>("SMTP_PASS"),
            },
        });
    }

    async sendPasswordResetEmail(to: string, token: string) {
        // In a real app, this would link to the frontend reset page
        // e.g., https://myapp.com/reset-password?token=...
        // For now, we will just send the token.

        // Use FRONTEND_URL from environment or default to localhost:5173
        const frontendUrl =
            this.configService.get<string>("FRONTEND_URL") ||
            "http://localhost:5173";
        const resetLink = `${frontendUrl}/reset-password?token=${token}`;

        const mailOptions = {
            from: this.fromEmail,
            to,
            subject: "Password Reset Request",
            html: `
                <p>You requested a password reset.</p>
                <p>Click the link below to reset your password:</p>
                <a href="${resetLink}">Reset Password</a>
                <p>If you did not request this, please ignore this email.</p>
            `,
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log("Message sent: %s", info.messageId);
            return info;
        } catch (error) {
            console.error("Error sending email", error);
            throw error;
        }
    }
}
