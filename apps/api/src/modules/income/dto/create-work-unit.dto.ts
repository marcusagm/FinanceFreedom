import { IsString, IsNotEmpty, IsNumber, IsPositive } from "class-validator";
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
}
