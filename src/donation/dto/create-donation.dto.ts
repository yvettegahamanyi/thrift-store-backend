import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDonationDto {
  @ApiProperty({ description: 'title of the donation' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'description of the donation' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: 'pick up address' })
  @IsNotEmpty()
  @IsString()
  pickupAddress: string;

  @ApiProperty({ description: 'pick up date' })
  @IsNotEmpty()
  @IsString()
  pickupDate?: string;
}
