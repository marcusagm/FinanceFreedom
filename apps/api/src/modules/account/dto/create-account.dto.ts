import {
    IsNotEmpty,
    IsString,
    IsNumber,
    IsOptional,
    IsHexColor,
    Min,
} from "class-validator";

export class CreateAccountDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    type: string;

    @IsNumber()
    balance: number;

    @IsString()
    @IsOptional()
    @IsHexColor()
    color?: string;

    @IsNumber()
    @IsOptional()
    interestRate?: number;

    @IsNumber()
    @IsOptional()
    minimumPayment?: number;

    @IsNumber()
    @IsOptional()
    dueDateDay?: number;
}
