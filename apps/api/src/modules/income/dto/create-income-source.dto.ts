import {
    IsString,
    IsNotEmpty,
    IsNumber,
    Min,
    Max,
    IsPositive,
} from "class-validator";
import { Type } from "class-transformer";

export class CreateIncomeSourceDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    amount: number;

    @IsNumber()
    @Min(1)
    @Max(31)
    @Type(() => Number)
    payDay: number;
}
