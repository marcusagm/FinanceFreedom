import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as crypto from "crypto";

@Injectable()
export class EncryptionService {
    private readonly algorithm = "aes-256-cbc";
    private readonly key: Buffer;
    private readonly logger = new Logger(EncryptionService.name);

    constructor(private configService: ConfigService) {
        let keyString = this.configService.get<string>("ENCRYPTION_KEY");

        if (!keyString) {
            this.logger.warn(
                "ENCRYPTION_KEY not found in env. Generating temporary key. THIS IS PERSISTENT ONLY IN MEMORY.",
            );
            // Generate a random key for this session if not provided (not ideal for persistence but prevents crash during dev setup)
            // In production this MUST be provided.
            this.key = crypto.randomBytes(32);
        } else {
            // Check if key is hex format (64 chars) or just a string
            if (keyString.length === 64 && /^[0-9a-fA-F]+$/.test(keyString)) {
                this.key = Buffer.from(keyString, "hex");
            } else {
                // If it's a passphrase, hash it to get 32 bytes
                this.key = crypto
                    .createHash("sha256")
                    .update(keyString)
                    .digest();
            }
        }
    }

    encrypt(text: string): string {
        try {
            const iv = crypto.randomBytes(16);
            const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
            let encrypted = cipher.update(text, "utf8", "hex");
            encrypted += cipher.final("hex");
            return `${iv.toString("hex")}:${encrypted}`;
        } catch (error) {
            this.logger.error("Encryption failed", error);
            throw new Error("Encryption failed");
        }
    }

    decrypt(text: string): string {
        try {
            const parts = text.split(":");
            if (parts.length !== 2) {
                // Return original text if not encrypted (migration support/fallback)
                // BUT this might be dangerous if we mistake encrypted for plain.
                // Assuming format IV:CONTENT is unique enough.
                return text;
            }

            const [ivHex, encryptedHex] = parts;
            const iv = Buffer.from(ivHex, "hex");

            // Validate IV length
            if (iv.length !== 16) return text;

            const decipher = crypto.createDecipheriv(
                this.algorithm,
                this.key,
                iv,
            );
            let decrypted = decipher.update(encryptedHex, "hex", "utf8");
            decrypted += decipher.final("utf8");
            return decrypted;
        } catch (error) {
            // Fail safe: assume text might not be encrypted or key changed.
            // In a strict system we should throw, but for gradual migration/dev we might return text if decrypt fails?
            // No, better to log and throw or return empty. returning text might leak secrets if we are confused.
            this.logger.error("Decryption failed", error);
            // If we can't decrypt, we can't use the password.
            throw new Error("Decryption failed");
        }
    }
}
