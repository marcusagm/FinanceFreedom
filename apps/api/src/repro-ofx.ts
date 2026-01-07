import * as fs from "fs";
import { parseStringPromise } from "xml2js";

const filePath =
    "/Volumes/Elleven-Files/Desenvolvimento/Aplicativos/FinanceFreedom/notes/Extrato-08-10-2025-a-06-01-2026-OFX.ofx";
// For Docker internal path, we might need to adjust or read content differently.
// Assuming we run this via ts-node, we can copy the file content here or read it if mounted.
// Since I can't guarantee the path inside the container matches my view_file path perfectly without checking volumes:
// I will read the file content using 'fs' if I run locally, or embed a snippet if running remotely.

// Let's rely on reading the file from the ABSOLUTE path I verified exists.
// Wait, 'docker exec' won't see '/Volumes/...'.
// I need to know where the volumes are mounted.
// docker-compose.yml says:
// - ./apps/api/src:/usr/src/app/src
// - ./apps/api/prisma:/usr/src/app/prisma

// The 'notes' folder is at root. It is NOT mounted into the API container.
// So I cannot read the file directly from within the container unless I copy it in or mount it.

// I'll copy the file content I read earlier into a string variable in this script.
// Since the file is 1500 lines, I'll take a significant chunk including the headers and the first transaction,
// and the end of the file.

const ofxContent = `OFXHEADER:100
DATA:OFXSGML
VERSION:102
SECURITY:NONE
ENCODING:USASCII
CHARSET:1252
COMPRESSION:NONE
OLDFILEUID:NONE
NEWFILEUID:NONE

<OFX>
<SIGNONMSGSRSV1>
<SONRS>
<STATUS>
<CODE>0</CODE>
<SEVERITY>INFO</SEVERITY>
</STATUS>
<DTSERVER>20260106</DTSERVER>
<LANGUAGE>POR</LANGUAGE>
<FI>
<ORG>Banco Intermedium S/A</ORG>
<FID>077</FID>
</FI>
</SONRS>
</SIGNONMSGSRSV1>
<BANKMSGSRSV1>
<STMTTRNRS>
<TRNUID>1001</TRNUID>
<STATUS>
<CODE>0</CODE>
<SEVERITY>INFO</SEVERITY>
</STATUS>
<STMTRS>
<CURDEF>BRL</CURDEF>
<BANKACCTFROM>
<BANKID>077</BANKID>
<BRANCHID>0001-9</BRANCHID>
<ACCTID>36183571</ACCTID>
<ACCTTYPE>CHECKING</ACCTTYPE>
</BANKACCTFROM>
<BANKTRANLIST>
<DTSTART>20251008</DTSTART>
<DTEND>20260106</DTEND>
<STMTTRN>
<TRNTYPE>PAYMENT</TRNTYPE>
<DTPOSTED>20260106</DTPOSTED>
<TRNAMT>-24.00</TRNAMT>
<FITID>202601060771</FITID>
<CHECKNUM>077</CHECKNUM>
<REFNUM>077</REFNUM>
<MEMO>Pix enviado: "Cp :08561701-IVO MARCOS MACIEL"</MEMO>
<NAME>Ivo Marcos Maciel</NAME>
</STMTTRN>
</BANKTRANLIST>
<LEDGERBAL>
<BALAMT>123.45</BALAMT>
<DTASOF>20260106</DTASOF>
</LEDGERBAL>
</STMTRS>
</STMTTRNRS>
</BANKMSGSRSV1>
</OFX>
`;

// Helper functions from OfxParserService
function extractXml(content: string): string {
    const startIndex = content.indexOf("<OFX>");
    if (startIndex !== -1) return content.substring(startIndex);
    const firstTag = content.indexOf("<");
    if (firstTag !== -1) return content.substring(firstTag);
    return content;
}

function sgmlToXml(sgml: string): string {
    let xml = sgml;
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

async function run() {
    console.log("--- Starting Repro ---");
    const xmlPart = extractXml(ofxContent);
    console.log("--- Extracted XML (First 100 chars) ---");
    console.log(xmlPart.substring(0, 100));

    const cleanXml = sgmlToXml(xmlPart);
    console.log("--- Cleaned XML (First 100 chars) ---");
    console.log(cleanXml.substring(0, 100));

    try {
        const result = await parseStringPromise(cleanXml, {
            explicitArray: false,
            trim: true,
        });
        console.log("--- Parse Success ---");
        console.log(JSON.stringify(result, null, 2));
    } catch (error) {
        console.error("--- Parse Error ---");
        console.error(error);
    }
}

run();
