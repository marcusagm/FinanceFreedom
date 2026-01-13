import {
    IsDateString,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
} from "class-validator";

export class UpdateTransactionDto {
    @IsOptional()
    @IsNumber()
    amount?: number;

    @IsOptional()
    @IsDateString()
    date?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsEnum(["INCOME", "EXPENSE"])
    type?: "INCOME" | "EXPENSE";

    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @IsString()
    accountId?: string;

    @IsOptional()
    isRecurring?: boolean;

    @IsOptional()
    @IsNumber()
    repeatCount?: number;
}
