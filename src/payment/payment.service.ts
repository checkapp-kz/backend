import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class PaymentService {
  private readonly SECRET_KEY = '9d6b69cbb0f4ea06ed969f34b68de9cb';
  private readonly MERCHANT_ID = 'BCC KZ';
  private readonly TERMINAL_ID = '88888881 MAC';
  private readonly MERCHANT_NAME = 'BCC KZ';

  generatePaymentLink(amount: number, orderId: string): string {
    const timestamp = '202412100611:36';
    const nonce = '91B635587254B2B9D8DC8B7C497AD870C';

    const params = new URLSearchParams({
      AMOUNT: amount.toString(),
      CURRENCY: 'KZT',
      ORDER: orderId,
      DESC: 'TRTYPE=1 test transaction',
      MERCHANT: this.MERCHANT_ID,
      MERCH_NAME: this.MERCHANT_NAME,
      TERMINAL: this.TERMINAL_ID,
      TIMESTAMP: timestamp,
      MERCH_GMT: '6',
      TRTYPE: '1',
      BACKREF:
        'https://test3ds.bcc.kz:5445/test/CamTestPages/webview/type1webview.html',
      LANG: 'ru',
      NONCE: nonce,
      MERCH_RN_ID: 'C141FFBA75464506',
      MK_TOKEN: 'MERCH',
    });

    params.append('P_SIGN', '57C2D9D363D6AAA70371539FF63521CF278F718290');

    return `https://test3ds.bcc.kz:5445/cgi-bin/cgi_link?${params.toString()}`;
  }

  private generateMInfo(): string {
    // Базовая информация о браузере/устройстве
    const mInfo = {
      browserScreenHeight: '1920',
      browserScreenWidth: '1080',
      mobilePhone: {
        cc: '7',
        subscriber: '7475558888',
      },
    };

    return Buffer.from(JSON.stringify(mInfo)).toString('base64');
  }

  verifyPaymentCallback(data: any, signature: string): boolean {
    const signString = `${data.amount};${data.currency};${data.orderId};${this.MERCHANT_ID};${this.TERMINAL_ID};${data.timestamp}`;
    const calculatedSign = crypto
      .createHmac('sha256', this.SECRET_KEY)
      .update(signString)
      .digest('hex');

    return calculatedSign === signature;
  }
}
