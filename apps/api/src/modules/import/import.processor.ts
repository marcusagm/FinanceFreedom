import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { ImapService } from "./imap.service";
import { OfxParserService } from "./ofx-parser.service";
import { SmartMergerService } from "./smart-merger.service";
import { TransactionService } from "../transaction/transaction.service";
import { PrismaService } from "../../prisma/prisma.service";
import { Logger } from "@nestjs/common";

@Processor("import-queue")
export class ImportProcessor extends WorkerHost {
    private readonly logger = new Logger(ImportProcessor.name);

    constructor(
        private readonly imapService: ImapService,
        private readonly ofxParser: OfxParserService,
        private readonly smartMerger: SmartMergerService,
        private readonly transactionService: TransactionService,
        private readonly prisma: PrismaService
    ) {
        super();
    }

    async process(job: Job<any, any, string>): Promise<any> {
        this.logger.log(`Processing job ${job.name}`);

        if (job.name === "check-emails") {
            await this.checkEmails();
        }
    }

    private async checkEmails() {
        // 1. Get all email credentials
        const credentials = await this.prisma.emailCredential.findMany({
            include: { account: true },
        });

        for (const cred of credentials) {
            try {
                this.logger.log(
                    `Checking email for account ${cred.account.name} (${cred.email})`
                );
                const attachments =
                    await this.imapService.fetchUnseenAttachments(cred);

                if (attachments.length > 0) {
                    this.logger.log(
                        `Found ${attachments.length} attachments for ${cred.email}`
                    );

                    for (const buffer of attachments) {
                        try {
                            const transactions = await this.ofxParser.parse(
                                buffer
                            );

                            // Assign account ID
                            transactions.forEach(
                                (t) => (t.accountId = cred.accountId)
                            );

                            // Filter
                            const unique =
                                await this.smartMerger.filterDuplicates(
                                    cred.accountId,
                                    transactions
                                );

                            if (unique.length > 0) {
                                this.logger.log(
                                    `Importing ${unique.length} unique transactions`
                                );

                                for (const t of unique) {
                                    await this.transactionService.create(t);
                                }
                            } else {
                                this.logger.log(
                                    "No new unique transactions found"
                                );
                            }
                        } catch (e) {
                            this.logger.error(
                                `Error processing attachment for ${cred.email}`,
                                e
                            );
                        }
                    }
                }
            } catch (e) {
                this.logger.error(`Error checking email ${cred.email}`, e);
            }
        }
    }
}
