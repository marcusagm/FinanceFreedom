import { PartialType } from "@nestjs/mapped-types";
import { CreateInvestmentAccountDto } from "./create-investment-account.dto";

export class UpdateInvestmentAccountDto extends PartialType(
    CreateInvestmentAccountDto
) {}
