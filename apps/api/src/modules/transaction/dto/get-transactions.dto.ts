import { IsOptional, IsString, IsInt, Min } from "class-validator";
import { Type } from "class-transformer";

export class GetTransactionsDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 50;

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsString()
    accountId?: string;

    @IsOptional()
    @IsString()
    categoryId?: string;

    @IsOptional()
    @IsString()
    startDate?: string;

    @IsOptional()
    @IsString()
    endDate?: string;

    @IsOptional()
    @IsString()
    currency?: string;

    @IsOptional()
    @IsString()
    status?: string;

    @IsOptional()
    @IsString()
    personId?: string;
}
