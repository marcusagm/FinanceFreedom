import { IsEmail, IsOptional, IsString } from "class-validator";

export class UpdateProfileDto {
    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    name?: string;
}
