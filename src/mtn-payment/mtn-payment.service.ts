import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MtnPaymentService {
  private readonly logger = new Logger(MtnPaymentService.name);
  private readonly apiUrl = 'url';
  private readonly subscriptionKey = 'YOUR_SUBSCRIPTION_KEY';
  private readonly authToken = 'YOUR_ACCESS_TOKEN'; // Get this using auth API

  async requestPayment(msisdn: string, amount: number, orderId: string) {
    const payload = {
      correlatorId: orderId,
      amount: { amount: amount, units: 'RWF' },
      totalAmount: { amount: amount, units: 'RWF' },
      payer: {
        payerId: msisdn,
      },
      payee: [
        {
          totalAmount: { amount: amount, units: 'RWF' },
        },
      ],
      paymentMethod: {
        type: 'Mobile Money',
      },
      additionalInformation: [
        { name: 'BundleName', description: 'Voice_1111' },
      ],
    };

    try {
      const response = await axios.post(
        `${this.apiUrl}/payments/payment-link`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Authorization': this.subscriptionKey,
            Authorization: `Bearer ${this.authToken}`,
          },
        },
      );
      return response;
    } catch (error) {
      this.logger.error('Error requesting payment', error);
      throw new Error('Payment request failed');
    }
  }

  async checkPaymentStatus(orderId: string, transactionId: string) {
    try {
      const response = await axios.get(
        `${this.apiUrl}/payments/${orderId}/transactionStatus`,
        {
          headers: {
            'Content-Type': 'application/json',
            transactionId: transactionId,
            'X-Authorization': this.subscriptionKey,
            Authorization: `Bearer ${this.authToken}`,
          },
        },
      );
      return response;
    } catch (error) {
      this.logger.error('Error checking payment status', error);
      throw new Error('Payment status check failed');
    }
  }
}
