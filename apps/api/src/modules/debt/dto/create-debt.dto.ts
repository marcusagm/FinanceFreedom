import {
    IsNotEmpty,
    IsString,
    IsNumber,
    Min,
    Max,
    IsOptional,
} from "class-validator";

export class CreateDebtDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    totalAmount: number;

    @IsNotEmpty()
    @IsNumber()
    interestRate: number;

    @IsNotEmpty()
    @IsNumber()
    minimumPayment: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(31)
    dueDate: number;

    @IsOptional()
    @IsString()
    categoryId?: string;

    @IsOptional()
    @IsNumber()
    priority?: number;
}
