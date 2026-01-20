import { IsNotEmpty, IsOptional, IsString, IsEmail } from "class-validator";

export class CreatePersonDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    phone?: string;
}
