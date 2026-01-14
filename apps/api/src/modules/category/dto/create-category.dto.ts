import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from "class-validator";

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    color?: string;

    @IsString()
    @IsOptional()
    icon?: string;

    @IsString()
    @IsOptional()
    // @IsEnum(['INCOME', 'EXPENSE']) // Optional validation
    type?: string;

    @IsNumber()
    @IsOptional()
    budgetLimit?: number;
}
