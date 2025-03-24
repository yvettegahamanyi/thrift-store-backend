import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SigninDto {
  @ApiProperty({ description: "User's email address" })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: "User's password" })
  @IsNotEmpty()
  @IsString()
  password: string;
}
