import { Injectable, Logger } from "@nestjs/common";
import { ImapService } from "./imap.service";
import { OfxParserService } from "./ofx-parser.service";
import { SmartMergerService } from "./smart-merger.service";
import { TransactionService } from "../transaction/transaction.service";
import { PrismaService } from "../../prisma/prisma.service";
import { EmailCredential } from "@prisma/client";

@Injectable()
export class ImportService {
    private readonly logger = new Logger(ImportService.name);

    constructor(
        private readonly imapService: ImapService,
        private readonly ofxParser: OfxParserService,
        private readonly smartMerger: SmartMergerService,
        private readonly transactionService: TransactionService,
        private readonly prisma: PrismaService
    ) {}

    async syncAllAccounts(userId?: string): Promise<number> {
        this.logger.log(
            `Starting sync for ${userId ? "user " + userId : "ALL accounts"}`
        );
        const where = userId ? { userId } : {};
        const credentials = await this.prisma.emailCredential.findMany({
            where,
            include: { account: true },
        });

        let totalImported = 0;
        for (const cred of credentials) {
            totalImported += await this.syncAccount(cred);
        }
        return totalImported;
    }

    async syncAccount(credential: EmailCredential): Promise<number> {
        let importedCount = 0;
        try {
            this.logger.log(
                `Checking email for account ${credential.accountId} (${credential.email})`
            );

            // TODO: Decrypt password in ImapService or here if needed, currently passed as is
            const attachments = await this.imapService.fetchUnseenAttachments(
                credential
            );

            if (attachments.length > 0) {
                this.logger.log(
                    `Found ${attachments.length} attachments for ${credential.email}`
                );

                for (const buffer of attachments) {
                    try {
                        const transactions = await this.ofxParser.parse(buffer);

                        // Assign account ID
                        transactions.forEach(
                            (t) => (t.accountId = credential.accountId)
                        );

                        // Filter
                        const unique = await this.smartMerger.filterDuplicates(
                            credential.userId,
                            credential.accountId,
                            transactions
                        );

                        if (unique.length > 0) {
                            this.logger.log(
                                `Importing ${unique.length} unique transactions`
                            );

                            for (const t of unique) {
                                await this.transactionService.create(
                                    credential.userId,
                                    t
                                );
                            }
                            importedCount += unique.length;
                        } else {
                            this.logger.log("No new unique transactions found");
                        }
                    } catch (e) {
                        this.logger.error(
                            `Error processing attachment for ${credential.email}`,
                            e
                        );
                    }
                }
            }
        } catch (e) {
            this.logger.error(`Error checking email ${credential.email}`, e);
        }

        return importedCount;
    }
}
