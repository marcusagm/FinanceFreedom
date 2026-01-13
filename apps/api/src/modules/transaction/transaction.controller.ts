import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    Delete,
    Request,
} from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";
import { SplitTransactionDto } from "./dto/split-transaction.dto";

@Controller("transactions")
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) {}

    @Post()
    create(
        @Request() req: any,
        @Body() createTransactionDto: CreateTransactionDto
    ) {
        return this.transactionService.create(
            req.user.userId,
            createTransactionDto
        );
    }

    @Get()
    findAll(@Request() req: any) {
        return this.transactionService.findAll(req.user.userId);
    }

    @Get(":id")
    findOne(@Request() req: any, @Param("id") id: string) {
        return this.transactionService.findOne(req.user.userId, id);
    }

    @Patch(":id")
    update(
        @Request() req: any,
        @Param("id") id: string,
        @Body() updateTransactionDto: UpdateTransactionDto
    ) {
        return this.transactionService.update(
            req.user.userId,
            id,
            updateTransactionDto
        );
    }

    @Delete(":id")
    remove(@Request() req: any, @Param("id") id: string) {
        return this.transactionService.remove(req.user.userId, id);
    }

    @Post(":id/split")
    split(
        @Request() req: any,
        @Param("id") id: string,
        @Body() splitTransactionDto: SplitTransactionDto
    ) {
        return this.transactionService.split(
            req.user.userId,
            id,
            splitTransactionDto
        );
    }
}
