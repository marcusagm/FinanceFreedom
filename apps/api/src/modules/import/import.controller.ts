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

@Controller("import")
export class ImportController {
    constructor(
        private readonly ofxParser: OfxParserService,
        private readonly smartMerger: SmartMergerService,
        private readonly transactionService: TransactionService
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
}
