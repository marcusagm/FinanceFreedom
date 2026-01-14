import {
    IsBoolean,
    IsDateString,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Max,
    Min,
} from "class-validator";

export class CreateFixedExpenseDto {
    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @IsInt()
    @Min(1)
    @Max(31)
    dueDay: number;

    @IsBoolean()
    @IsOptional()
    autoCreate?: boolean;

    @IsString()
    @IsNotEmpty()
    categoryId: string;

    @IsString()
    @IsNotEmpty()
    accountId: string;

    @IsDateString()
    @IsOptional()
    startDate?: string;

    @IsDateString()
    @IsOptional()
    endDate?: string;
}
