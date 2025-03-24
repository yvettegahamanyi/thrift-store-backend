import { Body, Controller, Post, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller({})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User Created Successfully',
    type: SignupDto,
  })
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('signin')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User logged in Successfully',
  })
  signin(@Body() signInDto: SigninDto) {
    return this.authService.signin(signInDto);
  }
}
