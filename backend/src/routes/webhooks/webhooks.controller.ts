import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Post,
  UseFilters,
} from '@nestjs/common';
import Stripe from 'stripe';

import { StripeErrorFilter, StripeService } from '../../libs/stripe';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('stripe')
  @UseFilters(StripeErrorFilter)
  async stripe(
    @Body() payload: string,
    @Headers('stripe-signature') signature?: string,
  ): Promise<void> {
    if (!signature) {
      throw new BadRequestException();
    }

    const event = this.stripeService.constructEvent(payload, signature);

    switch (event.type) {
      case 'invoice.payment_succeeded':
        await this.stripeService.updateSubscription(
          event.data.object as Stripe.Invoice,
        );
        break;
      case 'customer.subscription.deleted':
        await this.stripeService.deleteSubscription(
          event.data.object as Stripe.Subscription,
        );
        break;
      default:
        throw new BadRequestException('Webhook Error: Unexpected event type');
    }
  }
}
