import { Injectable, Logger } from "@nestjs/common";
import { parseStringPromise } from "xml2js";
import { CreateTransactionDto } from "../transaction/dto/create-transaction.dto";

@Injectable()
export class OfxParserService {
    private readonly logger = new Logger(OfxParserService.name);

    async parse(buffer: Buffer): Promise<CreateTransactionDto[]> {
        try {
            const ofxString = buffer.toString("utf-8");
            // Clean up OFX header if it's strict OFX/1.0 (key:value pairs before SGML)
            // This is a simplified cleanup. For robust parsing, might need more.
            const xmlPart = this.extractXml(ofxString);
            const cleanXml = this.sgmlToXml(xmlPart);

            const result = await parseStringPromise(cleanXml, {
                explicitArray: false,
                trim: true,
            });

            if (
                !result?.OFX?.BANKMSGSRSV1?.STMTTRNRS?.STMTRS?.BANKTRANLIST
                    ?.STMTTRN
            ) {
                throw new Error(
                    "Invalid OFX structure or no transactions found"
                );
            }

            const transactions =
                result.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN;

            // Ensure it's an array (xml2js returns object if single item)
            const list = Array.isArray(transactions)
                ? transactions
                : [transactions];

            return list.map((t: any) => this.mapToDto(t));
        } catch (error) {
            this.logger.error("Failed to parse OFX", error);
            throw new Error("Failed to parse OFX file");
        }
    }

    private extractXml(content: string): string {
        // Naive extraction: find first <OFX> or <
        const startIndex = content.indexOf("<OFX>");
        if (startIndex !== -1) return content.substring(startIndex);

        // Fallback if root tag is not capitalized or strictly OFX
        const firstTag = content.indexOf("<");
        if (firstTag !== -1) return content.substring(firstTag);

        return content as string;
    }

    private sgmlToXml(sgml: string): string {
        let xml = sgml;
        // Close tags that have values but no closing tag
        // Regex: <TAG>VALUE followed by <
        // We capture TAG and VALUE. We verify in the callback if the next < is a closing tag.
        xml = xml.replace(
            /<([A-Z0-9_]+)>([^<]+)(?=<)/g,
            (match, tag, value, offset, string) => {
                if (!value.trim()) return match;

                // Check if the next characters are the closing tag
                const nextChars = string.slice(offset + match.length);
                if (nextChars.startsWith(`</${tag}>`)) {
                    return match; // Already closed
                }

                return `<${tag}>${value}</${tag}>`;
            }
        );
        return xml;
    }

    private mapToDto(transaction: any): CreateTransactionDto {
        // OFX standard fields:
        // TRNAMT: Amount
        // DTPOSTED: Date (YYYYMMDDHHMMSS or similar)
        // MEMO: Description
        // TRNTYPE: Type (DEBIT, CREDIT, etc)

        const rawAmount = parseFloat(transaction.TRNAMT);
        const amount = Math.abs(rawAmount);
        const date = this.parseOfxDate(transaction.DTPOSTED);

        return {
            amount,
            date: date.toISOString(),
            description:
                transaction.MEMO || transaction.NAME || "No Description",
            type: rawAmount > 0 ? "INCOME" : "EXPENSE",
            accountId: "", // This needs to be filled by the caller context
            category: "Uncategorized",
        };
    }

    private parseOfxDate(dateStr: string): Date {
        // Format: YYYYMMDD...
        if (!dateStr || dateStr.length < 8) return new Date();

        const year = parseInt(dateStr.substring(0, 4));
        const month = parseInt(dateStr.substring(4, 6)) - 1;
        const day = parseInt(dateStr.substring(6, 8));

        return new Date(year, month, day);
    }
}
