import { Test, TestingModule } from "@nestjs/testing";
import { MailService } from "./mail.service";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";

// Mock nodemailer
const sendMailMock = jest.fn();
jest.mock("nodemailer", () => ({
    createTransport: jest.fn().mockImplementation(() => ({
        sendMail: sendMailMock,
    })),
}));

describe("MailService", () => {
    let service: MailService;
    let configService: ConfigService;

    const mockConfigService = {
        get: jest.fn((key: string) => {
            if (key === "SMTP_HOST") return "smtp.example.com";
            if (key === "SMTP_PORT") return 587;
            if (key === "SMTP_USER") return "user";
            if (key === "SMTP_PASS") return "pass";
            if (key === "SMTP_FROM") return '"Test" <test@example.com>';
            if (key === "FRONTEND_URL") return "http://frontend.com";
            return null;
        }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MailService,
                { provide: ConfigService, useValue: mockConfigService },
            ],
        }).compile();

        service = module.get<MailService>(MailService);
        configService = module.get<ConfigService>(ConfigService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("sendPasswordResetEmail", () => {
        it("should send email with correct link and options", async () => {
            const to = "recipient@example.com";
            const token = "test-token";
            const expectedLink =
                "http://frontend.com/reset-password?token=test-token";

            sendMailMock.mockResolvedValue({ messageId: "123" });

            await service.sendPasswordResetEmail(to, token);

            expect(nodemailer.createTransport).toHaveBeenCalled();
            expect(sendMailMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    to: to,
                    from: expect.any(String),
                    subject: "Password Reset Request",
                    html: expect.stringContaining(expectedLink),
                })
            );
        });

        it("should throw error if sending fails", async () => {
            sendMailMock.mockRejectedValue(new Error("SMTP Error"));

            await expect(
                service.sendPasswordResetEmail("to@test.com", "token")
            ).rejects.toThrow("SMTP Error");
        });
    });
});
