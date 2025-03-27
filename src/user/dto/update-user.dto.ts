import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { UserStatus } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ description: 'The status of the user' })
  @IsOptional()
  @IsString()
  status: UserStatus;
}
