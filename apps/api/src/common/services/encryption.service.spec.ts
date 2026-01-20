import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { EncryptionService } from "./encryption.service";
import { describe, it, expect, beforeEach, vi } from "vitest";

describe("EncryptionService", () => {
    let service: EncryptionService;

    beforeEach(() => {
        const mockConfigService = {
            get: vi
                .fn()
                .mockReturnValue(
                    "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
                ),
        };
        service = new EncryptionService(mockConfigService as any);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    it("should encrypt and decrypt correctly", () => {
        const original = "my-secret-password";
        const encrypted = service.encrypt(original);
        expect(encrypted).not.toBe(original);
        expect(encrypted).toContain(":");

        const decrypted = service.decrypt(encrypted);
        expect(decrypted).toBe(original);
    });
});
