import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    Body,
    BadRequestException,
    Get,
    Query,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { OfxParserService } from "./ofx-parser.service";
import { SmartMergerService } from "./smart-merger.service";
import { CreateTransactionDto } from "../transaction/dto/create-transaction.dto";
import { TransactionService } from "../transaction/transaction.service";
import { ImapService } from "./imap.service";
import { PrismaService } from "../../prisma/prisma.service";

@Controller("import")
export class ImportController {
    constructor(
        private readonly ofxParser: OfxParserService,
        private readonly smartMerger: SmartMergerService,
        private readonly transactionService: TransactionService,
        private readonly imapService: ImapService,
        private readonly prisma: PrismaService
    ) {}

    @Post("upload")
    @UseInterceptors(FileInterceptor("file"))
    async uploadFile(
        @UploadedFile() file: any,
        @Body("accountId") accountId: string
    ) {
        if (!file) {
            throw new BadRequestException("File is required");
        }
        if (!accountId) {
            throw new BadRequestException("Account ID is required");
        }

        const transactions = await this.ofxParser.parse(file.buffer);

        // Set accountId for all parsed transactions
        transactions.forEach((t) => (t.accountId = accountId));

        // Filter duplicates
        const uniqueTransactions = await this.smartMerger.filterDuplicates(
            accountId,
            transactions
        );

        return uniqueTransactions;
    }

    @Post("confirm")
    async confirmImport(@Body() transactions: CreateTransactionDto[]) {
        const results = [];
        const errors = [];

        for (const t of transactions) {
            try {
                const res = await this.transactionService.create(t);
                results.push(res);
            } catch (e) {
                errors.push({ transaction: t, error: e.message });
            }
        }

        return {
            imported: results.length,
            failed: errors.length,
            errors,
        };
    }
    @Get("imap-config")
    async getImapConfig(@Query("accountId") accountId: string) {
        if (!accountId) throw new BadRequestException("AccountId required");

        const config = await this.prisma.emailCredential.findFirst({
            where: { accountId },
        });

        if (!config) return null;

        return {
            ...config,
            password: "", // Mask password
            hasPassword: true,
        };
    }

    @Post("imap-config")
    async saveImapConfig(@Body() body: any) {
        const { accountId, host, port, secure, email, password } = body;

        if (!accountId || !host || !email) {
            throw new BadRequestException("Missing required fields");
        }

        // Check if config exists
        const existing = await this.prisma.emailCredential.findFirst({
            where: { accountId },
        });

        const data: any = {
            accountId,
            host,
            port: Number(port),
            secure: Boolean(secure),
            email,
        };

        if (password) {
            data.password = password; // TODO: Encrypt
        }

        if (existing) {
            return this.prisma.emailCredential.update({
                where: { id: existing.id },
                data,
            });
        }

        if (!password) {
            throw new BadRequestException("Password required for new config");
        }
        data.password = password;

        return this.prisma.emailCredential.create({
            data,
        });
    }

    @Post("imap-test")
    async testImapConfig(@Body() body: any) {
        // Can test with provided credentials OR saved credentials
        let { accountId, host, port, secure, email, password } = body;

        if (!password && accountId) {
            const saved = await this.prisma.emailCredential.findFirst({
                where: { accountId },
            });
            if (saved) {
                password = saved.password;
            }
        }

        if (!password) throw new BadRequestException("Password required");

        return this.imapService.testConnection({
            host,
            port: Number(port),
            secure: Boolean(secure),
            email,
            password,
        });
    }

    @Post("sync-now")
    async syncNow(@Body("accountId") accountId: string) {
        if (!accountId) throw new BadRequestException("AccountId required");

        const credential = await this.prisma.emailCredential.findFirst({
            where: { accountId },
        });

        if (!credential) throw new BadRequestException("No IMAP config found");

        // Trigger fetch
        const attachments = await this.imapService.fetchUnseenAttachments(
            credential
        );

        // Process attachments
        const results = [];
        for (const buffer of attachments) {
            try {
                const transactions = await this.ofxParser.parse(buffer);
                transactions.forEach((t) => (t.accountId = accountId));
                const unique = await this.smartMerger.filterDuplicates(
                    accountId,
                    transactions
                );

                // Auto-confirm for sync? Or save to staging?
                // Requirement: "sync manual" -> "permita a sincronização manual"
                // Let's create them directly for now, or returns them?
                // Typically sync implies auto-ingest.

                for (const t of unique) {
                    await this.transactionService.create(t);
                }
                results.push(...unique);
            } catch (e) {
                console.error("Error processing attachment", e);
            }
        }

        return { imported: results.length };
    }
}
