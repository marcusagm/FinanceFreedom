import { Injectable, Logger } from "@nestjs/common";
import { ImapFlow } from "imapflow";
import { EmailCredential } from "@prisma/client";

@Injectable()
export class ImapService {
    private readonly logger = new Logger(ImapService.name);

    async fetchUnseenAttachments(
        credential: EmailCredential
    ): Promise<Buffer[]> {
        const client = new ImapFlow({
            host: credential.host,
            port: credential.port,
            secure: credential.secure,
            auth: {
                user: credential.email,
                pass: credential.password, // TODO: Decrypt this
            },
            logger: false,
        });

        const attachments: Buffer[] = [];

        try {
            await client.connect();

            // Select specific folder (default to INBOX)
            const folder = credential.folder || "INBOX";
            const lock = await client.getMailboxLock(folder);
            try {
                // Build search criteria
                const searchCriteria: any = { seen: false };

                if (credential.sender) {
                    searchCriteria.from = credential.sender;
                }

                if (credential.subject) {
                    searchCriteria.subject = credential.subject;
                }

                // Correct approach with imapflow for searching unseen
                const list = await client.search(searchCriteria);

                if (list === false || list.length === 0) return [];

                for (const seq of list) {
                    const message = await client.fetchOne(seq, {
                        bodyStructure: true,
                        internalDate: true,
                        envelope: true,
                    });
                    if (!message || !message.bodyStructure) continue;

                    const parts = message.bodyStructure.childNodes;
                    if (!parts) continue;

                    for (const part of parts) {
                        const p = part as any; // Cast to avoid type issues with library definition
                        if (
                            p.disposition === "attachment" &&
                            (p.type === "application/x-ofx" ||
                                p.name?.toLowerCase().endsWith(".ofx") ||
                                p.parameters?.name
                                    ?.toLowerCase()
                                    .endsWith(".ofx"))
                        ) {
                            const content = await client.download(
                                seq,
                                part.part
                            );
                            // content is a stream? imapflow download returns { content, meta } where content is stream
                            if (content && content.content) {
                                const buf = await this.streamToBuffer(
                                    content.content
                                );
                                attachments.push(buf);
                            }
                        }
                    }

                    // Mark as seen?
                    await client.messageFlagsAdd(seq, ["\\Seen"]);
                }
            } finally {
                lock.release();
            }

            await client.logout();
        } catch (err) {
            this.logger.error("IMAP Error", err);
        }

        return attachments;
    }

    async testConnection(credential: {
        host: string;
        port: number;
        secure: boolean;
        email: string;
        password: string;
        folder?: string;
        sender?: string;
        subject?: string;
    }): Promise<{ success: boolean; message?: string }> {
        const client = new ImapFlow({
            host: credential.host,
            port: credential.port,
            secure: credential.secure,
            auth: {
                user: credential.email,
                pass: credential.password,
            },
            logger: false,
        });

        try {
            await client.connect();

            // Try to open the folder to verify it exists
            const folderName = credential.folder || "INBOX";
            await client.mailboxOpen(folderName);

            // Check for matching emails
            const searchCriteria: any = {};
            if (credential.sender) searchCriteria.from = credential.sender;
            if (credential.subject) searchCriteria.subject = credential.subject;

            // Search all matching (seen or unseen)
            const allMatches = await client.search(searchCriteria);
            const totalCount = allMatches === false ? 0 : allMatches.length;

            // Search unseen matching
            const unseenCriteria = { ...searchCriteria, seen: false };
            const unseenMatches = await client.search(unseenCriteria);
            const unseenCount =
                unseenMatches === false ? 0 : unseenMatches.length;

            await client.logout();

            return {
                success: true,
                message: `Connection successful! Found matching emails: ${totalCount} (Unseen: ${unseenCount}) in '${folderName}'`,
            };
        } catch (err) {
            this.logger.error("IMAP Test Error", err);
            return { success: false, message: err.message };
        }
    }

    private async streamToBuffer(stream: any): Promise<Buffer> {
        const chunks = [];
        for await (const chunk of stream) {
            chunks.push(chunk);
        }
        return Buffer.concat(chunks);
    }
}
