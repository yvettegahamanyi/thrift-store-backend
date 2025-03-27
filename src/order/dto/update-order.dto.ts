import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';
import { OrderStatus } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @ApiProperty({ description: 'Order status' })
  @IsOptional()
  @IsString()
  status: OrderStatus;
}
