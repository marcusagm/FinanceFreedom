import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { Logger } from "@nestjs/common";
import { ImportService } from "./import.service";

@Processor("import-queue")
export class ImportProcessor extends WorkerHost {
    private readonly logger = new Logger(ImportProcessor.name);

    constructor(private readonly importService: ImportService) {
        super();
    }

    async process(job: Job<any, any, string>): Promise<any> {
        this.logger.log(`Processing job ${job.name}`);

        if (job.name === "check-emails") {
            await this.importService.syncAllAccounts();
        }
    }
}
