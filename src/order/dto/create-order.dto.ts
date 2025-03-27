import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ description: 'The shipping address of the order' })
  @IsNotEmpty()
  @IsString()
  shippingAddress: string;

  @ApiProperty({ description: 'The payment number of the order' })
  @IsNotEmpty()
  @IsString()
  paymentNumber: string;

  @ApiProperty({ description: 'The cart id of the order' })
  @IsNotEmpty()
  @IsString()
  cartId: string;
}
