import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    Body,
    BadRequestException,
    Get,
    Query,
    Request,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { OfxParserService } from "./ofx-parser.service";
import { SmartMergerService } from "./smart-merger.service";
import { CreateTransactionDto } from "../transaction/dto/create-transaction.dto";
import { TransactionService } from "../transaction/transaction.service";
import { ImapService } from "./imap.service";
import { PrismaService } from "../../prisma/prisma.service";
import { ImportService } from "./import.service";
import { EncryptionService } from "../../common/services/encryption.service";

@Controller("import")
export class ImportController {
    constructor(
        private readonly ofxParser: OfxParserService,
        private readonly smartMerger: SmartMergerService,
        private readonly transactionService: TransactionService,
        private readonly imapService: ImapService,
        private readonly prisma: PrismaService,
        private readonly importService: ImportService,
        private readonly encryptionService: EncryptionService,
    ) {}

    @Post("upload")
    @UseInterceptors(FileInterceptor("file"))
    async uploadFile(
        @Request() req: any,
        @UploadedFile() file: any,
        @Body("accountId") accountId: string,
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
            req.user.userId,
            accountId,
            transactions,
        );

        return uniqueTransactions;
    }

    @Post("confirm")
    async confirmImport(
        @Request() req: any,
        @Body() transactions: CreateTransactionDto[],
    ) {
        const results = [];
        const errors = [];

        for (const t of transactions) {
            try {
                const res = await this.transactionService.create(
                    req.user.userId,
                    t,
                );
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
    @Get("imap-configs")
    async getImapConfigs(
        @Request() req: any,
        @Query("accountId") accountId: string,
    ) {
        if (!accountId) throw new BadRequestException("AccountId required");

        const configs = await this.prisma.emailCredential.findMany({
            where: { accountId, userId: req.user.userId },
        });

        return configs.map((c) => ({
            ...c,
            password: "", // Mask password
            hasPassword: true,
        }));
    }

    @Post("imap-config")
    async saveImapConfig(@Request() req: any, @Body() body: any) {
        const {
            id,
            accountId,
            host,
            port,
            secure,
            email,
            password,
            folder,
            sender,
            subject,
        } = body;

        if (!accountId || !host || !email) {
            throw new BadRequestException("Missing required fields");
        }

        const data: any = {
            accountId,
            host,
            port: Number(port),
            secure: Boolean(secure),
            email,
            folder: folder || "INBOX",
            sender: sender || null,
            subject: subject || null,
            userId: req.user.userId,
        };

        if (password) {
            data.password = this.encryptionService.encrypt(password);
        }

        if (id) {
            const existing = await this.prisma.emailCredential.findFirst({
                where: { id, userId: req.user.userId },
            });
            if (!existing) throw new BadRequestException("Config not found");

            // If updating and no password provided, keep existing
            if (!password) delete data.password;

            return this.prisma.emailCredential.update({
                where: { id },
                data,
            });
        }

        if (!password) {
            throw new BadRequestException("Password required for new config");
        }

        return this.prisma.emailCredential.create({
            data,
        });
    }

    @Post("imap-config/delete")
    async deleteImapConfig(@Request() req: any, @Body("id") id: string) {
        if (!id) throw new BadRequestException("ID required");
        const existing = await this.prisma.emailCredential.findFirst({
            where: { id, userId: req.user.userId },
        });
        if (!existing)
            throw new BadRequestException("Not found or access denied");
        return this.prisma.emailCredential.delete({ where: { id } });
    }

    @Post("imap-test")
    async testImapConfig(@Request() req: any, @Body() body: any) {
        let {
            id,
            accountId,
            host,
            port,
            secure,
            email,
            password,
            folder,
            sender,
            subject,
        } = body;

        // If testing an existing config, fetch password if not provided
        if (!password && id) {
            const saved = await this.prisma.emailCredential.findFirst({
                where: { id, userId: req.user.userId },
            });
            if (saved) {
                password = this.encryptionService.decrypt(saved.password);
            }
        }

        // Fallback: if user is testing a NEW config but forgot password? Front should validate.
        if (!password) throw new BadRequestException("Password required");

        return this.imapService.testConnection({
            host,
            port: Number(port),
            secure: Boolean(secure),
            email,
            password,
            // @ts-ignore
            folder,
            // @ts-ignore
            sender,
            // @ts-ignore
            subject,
        });
    }

    @Post("sync-now")
    async syncNow(@Request() req: any, @Body("accountId") accountId: string) {
        // If no accountId, sync all? Or maybe sync specific config?
        // Let's stick to syncing all configs for the account OR all accounts.

        if (!accountId) {
            // Sync ALL accounts for this user
            const count = await this.importService.syncAllAccounts(
                req.user.userId,
            );
            return { imported: count };
        }

        const credentials = await this.prisma.emailCredential.findMany({
            where: { accountId, userId: req.user.userId },
            include: { account: true },
        });

        if (!credentials || credentials.length === 0) {
            // Check if maybe we want to sync just one config?
            // For now, return 0
            return { imported: 0, message: "No IMAP configs found" };
        }

        let total = 0;
        for (const cred of credentials) {
            total += await this.importService.syncAccount(cred);
        }

        return { imported: total };
    }
}
