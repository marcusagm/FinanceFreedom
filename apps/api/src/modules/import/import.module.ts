import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { ImportController } from "./import.controller";
import { OfxParserService } from "./ofx-parser.service";
import { SmartMergerService } from "./smart-merger.service";
import { ImapService } from "./imap.service";
import { ImportProcessor } from "./import.processor";
import { TransactionModule } from "../transaction/transaction.module";
import { PrismaService } from "../../prisma/prisma.service";
import { ImportService } from "./import.service";

@Module({
    imports: [
        TransactionModule,
        BullModule.registerQueue({
            name: "import-queue",
        }),
    ],
    controllers: [ImportController],
    providers: [
        OfxParserService,
        SmartMergerService,
        ImapService,
        ImportProcessor,
        ImportService,
        PrismaService, // Should be imported from a CommonModule or DatabaseModule ideally, but locally proving for now if not global
    ],
    exports: [OfxParserService, SmartMergerService, ImapService, ImportService],
})
export class ImportModule {}
