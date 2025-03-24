import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/user.decorator';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }
}
