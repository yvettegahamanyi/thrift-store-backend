import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from 'src/common/enum/role.enum';
import { UserRole } from '@prisma/client';

export class SignupDto {
  @ApiProperty({ description: "User's first name" })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ description: "User's last name" })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ description: "User's email address" })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: "User's password" })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ description: "User's phone number", required: false })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ description: "User's address", required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: "User's role",
    enum: Role,
    default: UserRole.CUSTOMER,
  })
  @IsNotEmpty()
  @IsString()
  role: UserRole;
}
