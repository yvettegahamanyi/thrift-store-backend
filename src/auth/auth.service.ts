import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SigninDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

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
      return {
        data: userWithoutPassword,
        message: 'User created successfully',
        code: 201,
      };
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
      user.password,
      signInDto.password,
    );

    if (!isPasswordValid) {
      throw new ForbiddenException('Invalid credentials');
    }

    console.log('User ', this.signToken(user.id, user.email));
    return {
      access_token: await this.signToken(user.id, user.email),
      message: 'User logged in successfully',
      code: 201,
    };
  }

  async signToken(userId: string, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get<string>('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });

    return token;
  }
}
