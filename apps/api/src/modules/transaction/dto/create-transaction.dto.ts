import {
    IsDateString,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsEnum,
} from "class-validator";

export class CreateTransactionDto {
    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @IsNotEmpty()
    @IsDateString()
    date: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsEnum(["INCOME", "EXPENSE"])
    type: "INCOME" | "EXPENSE";

    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @IsString()
    debtId?: string;

    @IsNotEmpty()
    @IsString()
    accountId: string;

    @IsOptional()
    isRecurring?: boolean;

    @IsOptional()
    @IsNumber()
    repeatCount?: number;
}
