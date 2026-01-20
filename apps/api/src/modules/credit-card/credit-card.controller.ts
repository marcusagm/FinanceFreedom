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
        // Ensure userId is present. Assuming middleware/guard populates req.user
        // Fallback or explicit check needed?
        // Standard NestJS with Guard:
        const userId = req.user?.id || "mock-user-id"; // TODO: Remove mock
        return this.creditCardService.create(userId, createCreditCardDto);
    }

    @Get()
    findAll(@Req() req: any) {
        const userId = req.user?.id || "mock-user-id";
        return this.creditCardService.findAll(userId);
    }

    @Get(":id")
    findOne(@Param("id") id: string, @Req() req: any) {
        const userId = req.user?.id || "mock-user-id";
        return this.creditCardService.findOne(userId, id);
    }

    @Patch(":id")
    update(
        @Param("id") id: string,
        @Body() updateCreditCardDto: UpdateCreditCardDto,
        @Req() req: any,
    ) {
        const userId = req.user?.id || "mock-user-id";
        return this.creditCardService.update(userId, id, updateCreditCardDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string, @Req() req: any) {
        const userId = req.user?.id || "mock-user-id";
        return this.creditCardService.remove(userId, id);
    }

    @Get(":id/invoice")
    getInvoice(
        @Param("id") id: string,
        @Query("month") month: number,
        @Query("year") year: number,
        @Req() req: any,
    ) {
        const userId = req.user?.id || "mock-user-id";
        return this.creditCardService.getInvoice(
            userId,
            id,
            Number(month),
            Number(year),
        );
    }

    @Get(":id/limit")
    getAvailableLimit(@Param("id") id: string, @Req() req: any) {
        const userId = req.user?.id || "mock-user-id";
        return this.creditCardService.calculateAvailableLimit(userId, id);
    }
}
