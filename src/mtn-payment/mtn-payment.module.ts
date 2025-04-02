import { Module } from '@nestjs/common';
import { MtnPaymentService } from './mtn-payment.service';

@Module({
  providers: [MtnPaymentService],
  exports: [MtnPaymentService],
})
export class MtnPaymentModule {}
