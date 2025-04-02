import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { DonationModule } from './donation/donation.module';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
import { MtnPaymentService } from './mtn-payment/mtn-payment.service';
import { MtnPaymentModule } from './mtn-payment/mtn-payment.module';
import { StatisticsModule } from './statistics/statistics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    PrismaModule,
    DonationModule,
    ProductModule,
    CartModule,
    OrderModule,
    PaymentModule,
    MtnPaymentModule,
    StatisticsModule,
  ],
  providers: [MtnPaymentService],
})
export class AppModule {}
