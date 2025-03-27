import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCartDto {
  @ApiProperty({ description: 'The id of the product' })
  @IsNotEmpty()
  @IsString()
  productId: string;
}
