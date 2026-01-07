import { Test, TestingModule } from "@nestjs/testing";
import { ImapService } from "./imap.service";
import { ImapFlow } from "imapflow";

// Mock imapflow
jest.mock("imapflow", () => {
    return {
        ImapFlow: jest.fn().mockImplementation(() => ({
            connect: jest.fn(),
            getMailboxLock: jest.fn().mockResolvedValue({
                release: jest.fn(),
            }),
            search: jest.fn(),
            fetchOne: jest.fn(),
            download: jest.fn(),
            messageFlagsAdd: jest.fn(),
            logout: jest.fn(),
            fetch: jest.fn().mockReturnValue((async function* () {})()), // Async generator mock
        })),
    };
});

describe("ImapService", () => {
    let service: ImapService;
    let mockClient: any;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ImapService],
        }).compile();

        service = module.get<ImapService>(ImapService);

        // Reset mocks
        (ImapFlow as any).mockClear();
    });

    describe("testConnection", () => {
        it("should return success on connection", async () => {
            const result = await service.testConnection({} as any);
            expect(result.success).toBe(true);
        });

        it("should return failure on error", async () => {
            // We need to access the mock instance created inside the service
            // Since ImapFlow is a class, we mock the constructor.
            // However, to force an error on connect, we need specific setup.
            // Easier way:
            (ImapFlow as unknown as jest.Mock).mockImplementationOnce(() => ({
                connect: jest.fn().mockRejectedValue(new Error("Fail")),
                logout: jest.fn(),
            }));

            const result = await service.testConnection({} as any);
            expect(result.success).toBe(false);
            expect(result.message).toBe("Fail");
        });
    });
});
