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
      const { pickupDate, ...otherData } = createDonationDto;

      const formattedPickupDate = pickupDate
        ? new Date(pickupDate).toISOString()
        : null;

      const donation = await this.prisma.donation.create({
        data: {
          donorId: userId,
          pickupDate: formattedPickupDate as string,
          ...otherData,
        },
      });

      return {
        data: donation,
        message: 'Donation created successfully',
        code: 201,
      };
    } catch (error) {
      console.error('Error creating donation:', error);

      if (error instanceof Error) {
        throw new Error(`Failed to create donation: ${error.message}`);
      }

      throw new Error(
        'An unexpected error occurred while creating the donation.',
      );
    }
  }
  async findAll(user: User, searchKey?: string) {
    // Define the base query
    const query: {
      where?: Record<string, any>;
      include: {
        donor: boolean;
        products: boolean;
      };
    } = {
      include: {
        donor: true,
        products: true,
      },
    };

    // If the user is a donor, restrict the query to their donations
    if (user.role === UserRole.DONOR) {
      query.where = {
        donorId: user.id,
      };
    }

    // If a searchKey is provided, add search conditions
    if (searchKey) {
      query.where = {
        ...query.where,
        OR: [
          {
            donor: { firstName: { contains: searchKey, mode: 'insensitive' } },
          },
          { donor: { lastName: { contains: searchKey, mode: 'insensitive' } } },
          { donor: { email: { contains: searchKey, mode: 'insensitive' } } },
          { title: { contains: searchKey, mode: 'insensitive' } },
        ],
      };
    }

    // Execute the query
    const donations = await this.prisma.donation.findMany(query);

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
      include: {
        donor: true,
        products: true,
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
    const updatedDonation = await this.prisma.donation.update({
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
