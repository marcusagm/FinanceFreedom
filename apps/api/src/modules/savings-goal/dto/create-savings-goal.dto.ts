import {
    IsString,
    IsNumber,
    IsOptional,
    IsDateString,
    IsInt,
} from "class-validator";

export class CreateSavingsGoalDto {
    @IsString()
    name: string;

    @IsNumber()
    targetAmount: number;

    @IsNumber()
    @IsOptional()
    currentAmount?: number;

    @IsDateString() // Allows ISO date strings
    @IsOptional()
    deadline?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsInt()
    @IsOptional()
    priority?: number;

    @IsString()
    @IsOptional()
    status?: string; // IN_PROGRESS, COMPLETED, PAUSED
}
