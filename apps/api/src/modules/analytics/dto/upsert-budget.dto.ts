import { IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpsertBudgetDto {
    @IsNotEmpty()
    @IsString()
    categoryId: string;

    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @IsNotEmpty()
    @IsDateString()
    date: string; // YYYY-MM-DD
}
