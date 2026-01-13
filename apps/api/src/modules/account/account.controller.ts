import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Request,
} from "@nestjs/common";
import { AccountService } from "./account.service";
import { CreateAccountDto } from "./dto/create-account.dto";
import { UpdateAccountDto } from "./dto/update-account.dto";

@Controller("accounts")
export class AccountController {
    constructor(private readonly accountService: AccountService) {}

    @Post()
    create(@Request() req: any, @Body() createAccountDto: CreateAccountDto) {
        return this.accountService.create(req.user.userId, createAccountDto);
    }

    @Get()
    findAll(@Request() req: any) {
        return this.accountService.findAll(req.user.userId);
    }

    @Patch(":id")
    update(
        @Request() req: any,
        @Param("id") id: string,
        @Body() updateAccountDto: UpdateAccountDto
    ) {
        return this.accountService.update(
            req.user.userId,
            id,
            updateAccountDto
        );
    }

    @Delete(":id")
    remove(@Request() req: any, @Param("id") id: string) {
        return this.accountService.remove(req.user.userId, id);
    }
}
