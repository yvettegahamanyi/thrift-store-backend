import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, UserRole } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createOrderDto: CreateOrderDto) {
    const { cartId, shippingAddress } = createOrderDto;

    // Check if the user exists
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException('User not found');

    // Check if the cart exists and is active
    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
      include: { products: true },
    });

    if (!cart || !cart.isActive)
      throw new BadRequestException('Cart not found or is inactive');

    // Ensure cart has products
    if (cart.products.length === 0)
      throw new BadRequestException('Cart is empty');

    // Calculate total amount
    const totalAmount = cart.products.reduce(
      (sum, product) => sum + Number(product.price),
      0,
    );

    // Generate a unique reference number
    const refNumber = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    // Create the order
    const order = await this.prisma.order.create({
      data: {
        userId,
        refNumber,
        totalAmount,
        shippingAddress,
        products: {
          connect: cart.products.map((product) => ({ id: product.id })),
        },
      },
    });

    // Deactivate the cart
    await this.prisma.cart.update({
      where: { id: cartId },
      data: { isActive: false },
    });

    return {
      data: order,
      message: 'Order created successfully',
      code: 201,
    };
  }

  async findAll(user: User) {
    // If user is an admin, return all orders; otherwise, return only their orders
    const orders = await this.prisma.order.findMany({
      where: user.role === UserRole.ADMIN ? {} : { userId: user.id },
      include: { products: true }, // Populate products
    });

    return {
      data: orders,
      message: 'Orders fetched successfully',
      code: 200,
    };
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: id },
      include: { products: true }, // Populate products
    });

    if (!order) throw new BadRequestException('Order not found');

    return {
      data: order,
      message: 'Order fetched successfully',
      code: 200,
    };
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const { shippingAddress, status } = updateOrderDto;

    // Check if order exists
    const existingOrder = await this.prisma.order.findUnique({
      where: { id: id },
    });
    if (!existingOrder) throw new BadRequestException('Order not found');

    // Update the order
    const updatedOrder = await this.prisma.order.update({
      where: { id: id },
      data: {
        status,
        shippingAddress,
      },
      include: { products: true }, // Populate products
    });

    return {
      data: updatedOrder,
      message: 'Order updated successfully',
      code: 200,
    };
  }
}
