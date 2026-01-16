import { Test, TestingModule } from "@nestjs/testing";
import { ImportProcessor } from "./import.processor";
import { ImportService } from "./import.service";
import { Job } from "bullmq";

describe("ImportProcessor", () => {
    let processor: ImportProcessor;
    let importService: ImportService;

    const mockImportService = {
        syncAllAccounts: jest.fn(),
    };

    beforeEach(async () => {
        mockImportService.syncAllAccounts.mockClear();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ImportProcessor,
                { provide: ImportService, useValue: mockImportService },
            ],
        }).compile();

        processor = module.get<ImportProcessor>(ImportProcessor);
        importService = module.get<ImportService>(ImportService);
    });

    it("should be defined", () => {
        expect(processor).toBeDefined();
    });

    it("should call syncAllAccounts when job name is check-emails", async () => {
        const job = { name: "check-emails" } as Job;

        await processor.process(job);

        expect(importService.syncAllAccounts).toHaveBeenCalled();
    });

    it("should not call syncAllAccounts for other jobs", async () => {
        const job = { name: "other-job" } as Job;

        await processor.process(job);

        expect(importService.syncAllAccounts).not.toHaveBeenCalled();
    });
});
