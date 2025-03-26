import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UpdateDonationDto } from './dto/update-donation.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, UserRole } from '@prisma/client';

@Injectable()
export class DonationService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createDonationDto: CreateDonationDto) {
    try {
      const donation = await this.prisma.donation.create({
        data: {
          donorId: userId,
          ...createDonationDto,
        },
      });

      return donation;
    } catch (error) {
      // Optional: add error handling
      throw new Error(
        `Failed to create donation: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  findAll(user: User) {
    //check if user is a donor and fetch donations by donorId else fetch all donations
    if (user.role === UserRole.DONOR) {
      const donations = this.prisma.donation.findMany({
        where: {
          donorId: user.id,
        },
      });
      return {
        data: donations,
        message: 'Donations fetched successfully',
        code: 200,
      };
    }
    const donations = this.prisma.donation.findMany();
    return {
      data: donations,
      message: 'Donations fetched successfully',
      code: 200,
    };
  }

  async findOne(id: string) {
    const donation = await this.prisma.donation.findUnique({
      where: {
        id: id,
      },
    });
    // if it is not found, throw an error
    if (!donation) {
      throw new BadRequestException('Donation not found');
    }
    return {
      data: donation,
      message: 'Donation fetched successfully',
      code: 200,
    };
  }

  async update(id: string, updateDonationDto: UpdateDonationDto) {
    // check if the donation exists
    const donation = await this.prisma.donation.findUnique({
      where: {
        id: id,
      },
    });
    // if it is not found, throw an error
    if (!donation) {
      throw new BadRequestException('Donation not found');
    }
    // if donation is found update it
    const updatedDonation = this.prisma.donation.update({
      where: {
        id: id,
      },
      data: updateDonationDto,
    });

    return {
      data: updatedDonation,
      message: 'Donation updated successfully',
      code: 200,
    };
  }
}
