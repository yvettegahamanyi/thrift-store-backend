import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Put,
  Query,
} from '@nestjs/common';
import { DonationService } from './donation.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UpdateDonationDto } from './dto/update-donation.dto';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { GetUser } from 'src/auth/decorator/user.decorator';
import { User } from '@prisma/client';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('donation')
export class DonationController {
  constructor(private readonly donationService: DonationService) {}

  @Post()
  create(@GetUser() user: User, @Body() createDonationDto: CreateDonationDto) {
    return this.donationService.create(user?.id, createDonationDto);
  }

  @Get()
  @ApiQuery({
    name: 'searchKey',
    required: false,
    type: String,
  })
  findAll(@GetUser() user: User, @Query('searchKey') searchKey?: string) {
    return this.donationService.findAll(user, searchKey);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.donationService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateDonationDto: UpdateDonationDto,
  ) {
    return this.donationService.update(id, updateDonationDto);
  }
}
