import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsHexColor,
  Min,
} from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsNumber()
  @Min(0)
  balance: number;

  @IsString()
  @IsOptional()
  @IsHexColor()
  color?: string;
}
