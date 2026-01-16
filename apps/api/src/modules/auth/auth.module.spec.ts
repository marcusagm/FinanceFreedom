import { Test, TestingModule } from "@nestjs/testing";
import { AuthModule } from "./auth.module";
import { AuthService } from "./auth.service";
import { PrismaService } from "../../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { MailService } from "../mail/mail.service";

describe("AuthModule", () => {
    let module: TestingModule;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            imports: [AuthModule],
        })
            .overrideProvider(PrismaService)
            .useValue({})
            .overrideProvider(JwtService)
            .useValue({})
            .overrideProvider(ConfigService)
            .useValue({ get: jest.fn() })
            .overrideProvider(MailService)
            .useValue({ sendMail: jest.fn() })
            .compile();
    });

    it("should be defined", () => {
        expect(module).toBeDefined();
    });

    it("should provide AuthService", () => {
        const service = module.get<AuthService>(AuthService);
        expect(service).toBeDefined();
    });
});
