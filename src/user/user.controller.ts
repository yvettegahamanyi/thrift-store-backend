import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/user.decorator';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { UserService } from './user.service';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Get('/')
  getAllUsers() {
    return this.userService.getAllUsers();
  }
  @Post('create')
  createUser(@Body() data: User) {
    return this.userService.createUser(data);
  }

  @Get('/:id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Put('/:id')
  update(@Param('id') id: string, @Body() data: User) {
    return this.userService.updateUser(id, data);
  }
}
