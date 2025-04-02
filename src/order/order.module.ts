import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MtnPaymentModule } from 'src/mtn-payment/mtn-payment.module';

@Module({
  imports: [MtnPaymentModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
