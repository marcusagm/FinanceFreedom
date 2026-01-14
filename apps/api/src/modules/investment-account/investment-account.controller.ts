import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Request,
    UseGuards,
    InternalServerErrorException,
} from "@nestjs/common";
import { InvestmentAccountService } from "./investment-account.service";
import { CreateInvestmentAccountDto } from "./dto/create-investment-account.dto";
import { UpdateInvestmentAccountDto } from "./dto/update-investment-account.dto";

@Controller("investment-accounts")
export class InvestmentAccountController {
    constructor(
        private readonly investmentAccountService: InvestmentAccountService
    ) {}

    @Post()
    async create(
        @Request() req: any,
        @Body() createInvestmentAccountDto: CreateInvestmentAccountDto
    ) {
        try {
            return await this.investmentAccountService.create(
                req.user.userId,
                createInvestmentAccountDto
            );
        } catch (error) {
            console.error("Error creating investment account:", error);
            throw new InternalServerErrorException(
                error.message || "Failed to create account"
            );
        }
    }

    @Get()
    findAll(@Request() req: any) {
        return this.investmentAccountService.findAll(req.user.userId);
    }

    @Get(":id")
    findOne(@Request() req: any, @Param("id") id: string) {
        return this.investmentAccountService.findOne(req.user.userId, id);
    }

    @Patch(":id")
    update(
        @Request() req: any,
        @Param("id") id: string,
        @Body() updateInvestmentAccountDto: UpdateInvestmentAccountDto
    ) {
        return this.investmentAccountService.update(
            req.user.userId,
            id,
            updateInvestmentAccountDto
        );
    }

    @Delete(":id")
    remove(@Request() req: any, @Param("id") id: string) {
        return this.investmentAccountService.remove(req.user.userId, id);
    }
}
