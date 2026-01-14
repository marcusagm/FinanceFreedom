import {
    IsString,
    IsNumber,
    IsOptional,
    IsEnum,
    IsDate,
} from "class-validator";
import { Type } from "class-transformer";

export class CreateInvestmentAccountDto {
    @IsString()
    name: string;

    @IsString()
    // Could use Enum validation here: FIXED_INCOME, VARIABLE_INCOME, CRYPTO, CASH, OTHER
    type: string;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    balance?: number;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    profitability?: number;

    @IsString()
    @IsOptional()
    profitabilityType?: string;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    maturityDate?: Date;
}
