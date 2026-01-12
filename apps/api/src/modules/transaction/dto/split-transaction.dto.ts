import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class SplitTransactionItemDto {
    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsOptional()
    @IsString()
    category?: string;
}

export class SplitTransactionDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SplitTransactionItemDto)
    splits: SplitTransactionItemDto[];
}
