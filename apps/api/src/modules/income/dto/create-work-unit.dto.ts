import {
    IsString,
    IsNotEmpty,
    IsNumber,
    IsPositive,
    Min,
    Max,
    IsOptional,
} from "class-validator";
import { Type } from "class-transformer";

export class CreateWorkUnitDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    defaultPrice: number;

    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    estimatedTime: number;

    @IsNumber()
    @Min(0)
    @Max(100)
    @IsOptional()
    @Type(() => Number)
    taxRate?: number;
}
