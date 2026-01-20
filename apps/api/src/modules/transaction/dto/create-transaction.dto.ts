import {
    IsDateString,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsEnum,
    IsBoolean,
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
    categoryId?: string;

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

    @IsOptional()
    @IsString()
    currency?: string;

    @IsOptional()
    @IsString()
    status?: string;

    @IsOptional()
    @IsString()
    personId?: string;

    @IsOptional()
    @IsString()
    creditCardId?: string;

    @IsOptional()
    @IsNumber()
    installmentNumber?: number;

    @IsOptional()
    @IsNumber()
    totalInstallments?: number;

    @IsOptional()
    @IsBoolean() // Correcting type
    paysInstallment?: boolean;
}
