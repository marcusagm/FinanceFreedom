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

            const lock = await client.getMailboxLock("INBOX");
            try {
                // Fetch unseen messages
                for await (const message of client.fetch(
                    "1:*",
                    { flags: true, envelope: true, bodyStructure: true },
                    { uid: true }
                )) {
                    // Note: 'unseen' filter usually done in search, but imapflow fetch can filter?
                    // client.fetch({ seen: false } ...)
                }

                // Correct approach with imapflow for searching unseen
                const list = await client.search({ seen: false });

                if (list === false) return [];

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

    private async streamToBuffer(stream: any): Promise<Buffer> {
        const chunks = [];
        for await (const chunk of stream) {
            chunks.push(chunk);
        }
        return Buffer.concat(chunks);
    }
}
