import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Cart } from '@prisma/client';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createCartDto: CreateCartDto) {
    const { productId } = createCartDto;
    try {
      // Check if user exists
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new Error('User not found');

      // Check if product exists
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
      });
      if (!product) throw new Error('Product not found');

      // Find the user's active cart
      let cart = await this.prisma.cart.findFirst({
        where: {
          userId,
          isActive: true,
        },
        include: { products: true },
      });

      if (!cart) {
        // If no active cart exists, create a new cart
        cart = await this.prisma.cart.create({
          data: {
            userId,
            products: { connect: { id: productId } }, // Add the product to the cart
          },
          include: {
            products: true, // Include products in the returned cart
          },
        });
      } else {
        // If cart exists, add the product (avoid duplicates)
        const productExists = cart.products.some((p) => p.id === productId);
        if (!productExists) {
          await this.prisma.cart.update({
            where: { id: cart.id },
            data: {
              products: { connect: { id: productId } },
            },
          });
        }
      }

      return {
        data: cart,
        message: 'Product added to cart successfully',
        code: 201,
      };
    } catch (error) {
      console.error(error);
      return { error: error.message };
    }
  }

  async findOne(id: string) {
    try {
      // Find cart with products populated
      const cart = await this.prisma.cart.findUnique({
        where: { id: id },
        include: {
          products: true, // Populating products in the cart
        },
      });

      if (!cart) {
        throw new BadRequestException('Cart not found');
      }

      return {
        data: cart,
        message: 'Cart fetched successfully',
        code: 200,
      };
    } catch (error) {
      console.error(error);
      return { error: error.message };
    }
  }

  async findActiveCart(userId: string) {
    try {
      // Find the active cart for the user
      const cart = await this.prisma.cart.findFirst({
        where: {
          userId: userId,
          isActive: true,
        },
        include: {
          products: true, // Populate products in the cart
        },
      });

      if (!cart) {
        return { message: 'No active cart found for this user' };
      }

      return {
        data: cart,
        message: 'Active cart fetched successfully',
        code: 200,
      };
    } catch (error) {
      console.error(error);
      return { error: error.message };
    }
  }
}
