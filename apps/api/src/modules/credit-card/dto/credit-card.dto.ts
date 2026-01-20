import {
    IsString,
    IsNotEmpty,
    IsDecimal,
    IsInt,
    Min,
    Max,
    IsOptional,
    IsUUID,
} from "class-validator";
import { Transform } from "class-transformer";

export class CreateCreditCardDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    brand: string;

    @IsDecimal()
    @IsNotEmpty()
    limit: string | number;

    @IsInt()
    @Min(1)
    @Max(31)
    closingDay: number;

    @IsInt()
    @Min(1)
    @Max(31)
    dueDay: number;

    @IsOptional()
    @IsUUID()
    paymentAccountId?: string;
}

export class UpdateCreditCardDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    brand?: string;

    @IsOptional()
    @IsDecimal()
    limit?: string | number;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(31)
    closingDay?: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(31)
    dueDay?: number;

    @IsOptional()
    @IsUUID()
    paymentAccountId?: string;
}
