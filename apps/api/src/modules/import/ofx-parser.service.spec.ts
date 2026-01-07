import { Test, TestingModule } from "@nestjs/testing";
import { OfxParserService } from "./ofx-parser.service";

const mockOfx = `
OFXHEADER:100
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
<CODE>0
<SEVERITY>INFO
</STATUS>
<DTSERVER>20231026000000[-3:EST]
<LANGUAGE>ENG
</SONRS>
</SIGNONMSGSRSV1>
<BANKMSGSRSV1>
<STMTTRNRS>
<TRNUID>1001
<STATUS>
<CODE>0
<SEVERITY>INFO
</STATUS>
<STMTRS>
<CURDEF>BRL
<BANKACCTFROM>
<BANKID>341
<ACCTID>12345
<ACCTTYPE>CHECKING
</BANKACCTFROM>
<BANKTRANLIST>
<DTSTART>20231001000000[-3:EST]
<DTEND>20231031000000[-3:EST]
<STMTTRN>
<TRNTYPE>DEBIT
<DTPOSTED>20231025000000[-3:EST]
<TRNAMT>-50.00
<FITID>20231025001
<MEMO>Supermarket Purchase
</STMTTRN>
<STMTTRN>
<TRNTYPE>CREDIT
<DTPOSTED>20231024000000[-3:EST]
<TRNAMT>1000.00
<FITID>20231024001
<MEMO>Salary
</STMTTRN>
</BANKTRANLIST>
</STMTRS>
</STMTTRNRS>
</BANKMSGSRSV1>
</OFX>
`;

describe("OfxParserService", () => {
    let service: OfxParserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [OfxParserService],
        }).compile();

        service = module.get<OfxParserService>(OfxParserService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    it("should parse valid OFX", async () => {
        const buffer = Buffer.from(mockOfx);
        const result = await service.parse(buffer);

        expect(result).toHaveLength(2);
        expect(result[0].amount).toBe(50.0);
        expect(result[0].description).toBe("Supermarket Purchase");
        expect(result[0].type).toBe("EXPENSE");

        expect(result[1].amount).toBe(1000.0);
        expect(result[1].type).toBe("INCOME");
    });

    it("should handle single transaction", async () => {
        const singleOfx = `
OFXHEADER:100
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
<CODE>0
<SEVERITY>INFO
</STATUS>
<DTSERVER>20231026000000[-3:EST]
<LANGUAGE>ENG
</SONRS>
</SIGNONMSGSRSV1>
<BANKMSGSRSV1>
<STMTTRNRS>
<TRNUID>1001
<STATUS>
<CODE>0
<SEVERITY>INFO
</STATUS>
<STMTRS>
<CURDEF>BRL
<BANKACCTFROM>
<BANKID>341
<ACCTID>12345
<ACCTTYPE>CHECKING
</BANKACCTFROM>
<BANKTRANLIST>
<DTSTART>20231001000000[-3:EST]
<DTEND>20231031000000[-3:EST]
<STMTTRN>
<TRNTYPE>DEBIT
<DTPOSTED>20231025000000[-3:EST]
<TRNAMT>-50.00
<FITID>20231025001
<MEMO>Supermarket Purchase
</STMTTRN>
</BANKTRANLIST>
</STMTRS>
</STMTTRNRS>
</BANKMSGSRSV1>
</OFX>
`;
        const buffer = Buffer.from(singleOfx);
        const result = await service.parse(buffer);

        expect(result).toHaveLength(1);
        expect(result[0].amount).toBe(50.0);
    });
});
