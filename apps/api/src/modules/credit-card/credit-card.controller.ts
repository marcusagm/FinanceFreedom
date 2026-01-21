import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseGuards,
    Req,
} from "@nestjs/common";
import { CreditCardService } from "./credit-card.service";
import {
    CreateCreditCardDto,
    UpdateCreditCardDto,
} from "./dto/credit-card.dto";
// import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard"; // Assuming standard auth
// Using mock auth or simply requesting userId from logic if guard not globally applied,
// but standard in this project seems to be User is extracted from Request.

@Controller("credit-cards")
export class CreditCardController {
    constructor(private readonly creditCardService: CreditCardService) {}

    @Post()
    create(@Body() createCreditCardDto: CreateCreditCardDto, @Req() req: any) {
        return this.creditCardService.create(
            req.user.userId,
            createCreditCardDto,
        );
    }

    @Get()
    findAll(@Req() req: any) {
        return this.creditCardService.findAll(req.user.userId);
    }

    @Get(":id")
    findOne(@Param("id") id: string, @Req() req: any) {
        return this.creditCardService.findOne(req.user.userId, id);
    }

    @Patch(":id")
    update(
        @Param("id") id: string,
        @Body() updateCreditCardDto: UpdateCreditCardDto,
        @Req() req: any,
    ) {
        return this.creditCardService.update(
            req.user.userId,
            id,
            updateCreditCardDto,
        );
    }

    @Delete(":id")
    remove(@Param("id") id: string, @Req() req: any) {
        return this.creditCardService.remove(req.user.userId, id);
    }

    @Get(":id/invoice")
    getInvoice(
        @Param("id") id: string,
        @Query("month") month: number,
        @Query("year") year: number,
        @Req() req: any,
    ) {
        return this.creditCardService.getInvoice(
            req.user.userId,
            id,
            Number(month),
            Number(year),
        );
    }

    @Post(":id/invoice/pay")
    payInvoice(
        @Req() req: any,
        @Param("id") id: string,
        @Body() body: { month: number; year: number; accountId: string },
    ) {
        return this.creditCardService.payInvoice(
            req.user.userId,
            id,
            body.month,
            body.year,
            body.accountId,
        );
    }

    @Get(":id/limit")
    getAvailableLimit(@Param("id") id: string, @Req() req: any) {
        return this.creditCardService.calculateAvailableLimit(
            req.user.userId,
            id,
        );
    }
}
