import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { GetUser } from 'src/auth/decorator/user.decorator';
import { User } from '@prisma/client';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  create(@GetUser() user: User, @Body() createCartDto: CreateCartDto) {
    return this.cartService.create(user.id, createCartDto);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(id);
  }

  @Get('/activeCart')
  findUserActiveCart(@GetUser() user: User) {
    return this.cartService.findActiveCart(user.id);
  }
}
