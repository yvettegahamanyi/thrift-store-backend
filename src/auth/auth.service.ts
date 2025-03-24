import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SigninDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(signupDto: SignupDto) {
    const hash = await argon.hash(signupDto.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          ...signupDto,
          password: hash,
        },
      });

      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002')
          throw new ForbiddenException('Credentials taken');
      }
      throw err;
    }
  }

  async signin(signInDto: SigninDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: signInDto.email,
      },
    });
    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new ForbiddenException('User account is deactivated');
    }

    const isPasswordValid = await argon.verify(
      signInDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new ForbiddenException('Invalid credentials');
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;

    // const payload = { sub: user.id, email: user.email, role: user.role };
    // return {
    //   user,
    //   access_token: this.jwtService.sign(payload),
    // };
  }
}
