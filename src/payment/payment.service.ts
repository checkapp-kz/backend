import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import fetch from 'node-fetch';

@Injectable()
export class PaymentService {
  private readonly SECRET_KEY = '9d6b69cbb0f4ea06ed969f34b68de9cb';
  private readonly MERCHANT_ID = '00000001';
  private readonly TERMINAL_ID = '88888881';
  private readonly MERCHANT_NAME = 'TOO "MERCHANT"';

  async generatePaymentLink(amount: number, orderId: string): Promise<string> {
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/T/, '')
      .replace(/\..+/, '');
    const nonce = crypto.randomBytes(16).toString('hex').toUpperCase();

    const urlencoded = new URLSearchParams();
    urlencoded.append('AMOUNT', amount.toString());
    urlencoded.append('CURRENCY', '398');
    urlencoded.append('ORDER', orderId);
    urlencoded.append('MERCH_RN_ID', orderId);
    urlencoded.append(
      'DESC',
      'TRTYPE=1 test transaction (Challenge Flow + Fingerprint)',
    );
    urlencoded.append('MERCHANT', this.MERCHANT_ID);
    urlencoded.append('MERCH_NAME', this.MERCHANT_NAME);
    urlencoded.append('TERMINAL', this.TERMINAL_ID);
    urlencoded.append('TIMESTAMP', timestamp);
    urlencoded.append('MERCH_GMT', '+6');
    urlencoded.append('TRTYPE', '1');
    urlencoded.append(
      'BACKREF',
      'https://merchantdomain.kz/back/to/merchant/site',
    );
    urlencoded.append('LANG', 'ru');
    urlencoded.append('NONCE', nonce);
    urlencoded.append('P_SIGN', '');
    urlencoded.append('MK_TOKEN', 'MERCH');
    urlencoded.append(
      'NOTIFY_URL',
      'https://merchantdomain.kz:443/url/notify/callback',
    );
    urlencoded.append('CLIENT_IP', '0.0.0.0');
    urlencoded.append('M_INFO', this.generateMInfo());

    const requestOptions = {
      method: 'POST',
      body: urlencoded,
      redirect: 'follow' as RequestRedirect,
    };

    try {
      const response = await fetch(
        'https://test3ds.bcc.kz:5445/cgi-bin/cgi_link',
        requestOptions,
      );
      return await response.text();
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Failed to generate payment link');
    }
  }

  private generateMInfo(): string {
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
