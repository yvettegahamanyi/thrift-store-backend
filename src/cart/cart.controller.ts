import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Put,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { GetUser } from 'src/auth/decorator/user.decorator';
import { User } from '@prisma/client';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { UpdateCartDto } from './dto/update-cart.dto';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  create(@GetUser() user: User, @Body() createCartDto: CreateCartDto) {
    return this.cartService.create(user.id, createCartDto);
  }
  @Get('/getUserCart')
  findUserActiveCart(@GetUser() user: User) {
    return this.cartService.findActiveCart(user.id);
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(id);
  }

  @Put('removeProduct/:id')
  removeProduct(@Param('id') id: string, @Body() UpdateCartDto: UpdateCartDto) {
    return this.cartService.removeProductFromCart(
      id,
      UpdateCartDto.productId as string,
    );
  }
}
