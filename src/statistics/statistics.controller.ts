import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { GetUser } from 'src/auth/decorator/user.decorator';
import { User } from '@prisma/client';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('donor')
  async getDonorStatistics(@GetUser() user: User) {
    return this.statisticsService.getDonorStatistics(user.id);
  }
  @Get('admin')
  async getAdminStatistics() {
    return this.statisticsService.getAdminStatistics();
  }
}
