import { Injectable } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StatisticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDonorStatistics(donorId: string) {
    const pendingDonation = await this.prisma.donation.count({
      where: {
        donorId,
        status: 'PENDING',
      },
    });
    const approvedDonation = await this.prisma.donation.count({
      where: {
        donorId,
        status: 'APPROVED',
      },
    });
    const donations = await this.prisma.donation.findMany({
      where: {
        donorId,
      },
      select: {
        id: true,
      },
    });

    const totalProducts = await Promise.all(
      donations.map(async (donation) => {
        return this.prisma.product.count({
          where: {
            donationId: donation.id,
          },
        });
      }),
    ).then((counts) => counts.reduce((acc, count) => acc + count, 0));

    return {
      pendingDonation,
      approvedDonation,
      carbonFootprintKg: 10,
      totalProducts,
    };
  }

  async getAdminStatistics() {
    const pendingDonation = await this.prisma.donation.count({
      where: {
        status: 'PENDING',
      },
    });

    const productInStock = await this.prisma.product.count({
      where: {
        orderId: null,
      },
    });

    const PendingShipment = await this.prisma.order.count({
      where: {
        status: OrderStatus.PROCESSING,
      },
    });

    const totalRevenue = await this.prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },
      where: {
        status: OrderStatus.DELIVERED,
      },
    });
    const totalRevenueValue = totalRevenue._sum.totalAmount || 0;
    return {
      productInStock,
      pendingDonation,
      PendingShipment,
      totalRevenue: totalRevenueValue,
    };
  }
}
