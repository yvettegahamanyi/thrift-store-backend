import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateDonationDto } from './create-donation.dto';
import { DonationStatus } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';

export class UpdateDonationDto extends PartialType(CreateDonationDto) {
  @ApiProperty({ description: 'The status of the donation' })
  @IsOptional()
  @IsString()
  status: DonationStatus;
}
