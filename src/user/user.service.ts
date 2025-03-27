import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: CreateUserDto) {
    //check if user email doesn't exist
    const userExists = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (userExists) {
      return {
        data: null,
        message: 'User already exists',
        code: 400,
      };
    }

    const user = await this.prisma.user.create({
      data,
      select: {
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });
    return {
      data: user,
      message: 'User created successfully',
      code: 201,
    };
  }

  async getAllUsers() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        address: true,
        email: true,
        role: true,
        isActive: true,
        status: true,
        createdAt: true,
      },
    });
    return {
      data: users,
      message: 'Users fetched successfully',
      code: 200,
    };
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });
    return {
      data: user,
      message: 'User fetched successfully',
      code: 200,
    };
  }

  async updateUser(id: string, data: UpdateUserDto) {
    // console.log(data);
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data,
      select: {
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });
    return {
      data: user,
      message: 'User updated successfully',
      code: 200,
    };
  }
}
