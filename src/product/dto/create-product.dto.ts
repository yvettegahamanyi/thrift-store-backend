import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: 'name of the product' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'description of the product' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: 'Price of the product' })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'pick up date' })
  @IsNotEmpty()
  @IsString()
  pickupDate?: string;

  @ApiProperty({ description: 'donation id' })
  @IsNotEmpty()
  @IsString()
  donationId?: string;
}
