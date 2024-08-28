
import { Role } from '@prisma/client';
import { IsEmail, IsString, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  role?: Role; 
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
