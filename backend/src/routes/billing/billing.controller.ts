import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import Stripe from 'stripe';

import { CurrentUser } from '../../decorators/current-user.decorator';
import { RateLimit } from '../../libs/rate-limiter';
import { StripeErrorFilter, StripeService } from '../../libs/stripe';
import { User } from '../../schemas/user.schema';
import { minutes, seconds } from '../../utils/time.util';
import { RequiredAuthGuard } from '../auth/guards/required.guard';
import { SubscribeDto } from './dto/subscribe.dto';

@Controller('billing')
@UseFilters(StripeErrorFilter)
export class BillingController {
  constructor(private readonly stripeService: StripeService) {}

  @Get('customer')
  @UseGuards(RequiredAuthGuard)
  @RateLimit({ every: seconds(30) })
  getCustomer(@CurrentUser() user: User): Promise<Stripe.Customer> {
    return this.stripeService.getOrCreateCustomer(user);
  }

  @Get('plan/:plan')
  @RateLimit({ every: seconds(30) })
  async getPlan(@Param('plan') planName: string): Promise<Stripe.Plan> {
    const plan = await this.stripeService.getPlan(planName);

    if (!plan) {
      throw new NotFoundException();
    }

    return plan;
  }

  @Get('coupon/:coupon')
  @RateLimit({ every: seconds(1) })
  async getCoupon(@Param('coupon') coupon: string): Promise<Stripe.Coupon> {
    return this.stripeService.getCoupon(coupon);
  }

  @Get('upcoming-invoice')
  @UseGuards(RequiredAuthGuard)
  @RateLimit({ every: seconds(30) })
  getUpcomingInvoice(@CurrentUser() user: User): Promise<Stripe.Invoice> {
    if (!user.payments.stripeId) {
      throw new BadRequestException('No customer');
    }

    return this.stripeService.getUpcomingInvoice(user.payments.stripeId);
  }

  @Post('subscribe')
  @RateLimit({ every: minutes(1) })
  @UseGuards(RequiredAuthGuard)
  async subscribe(
    @CurrentUser() user: User,
    @Body() subscribeDto: SubscribeDto,
  ): Promise<Stripe.Subscription> {
    if (user.payments.stripeId) {
      await this.stripeService.attachPaymentMethod(
        user.payments.stripeId,
        subscribeDto.paymentMethod,
      );
    }

    const customer = await this.stripeService.getOrCreateCustomer(
      user,
      subscribeDto.paymentMethod,
    );

    if (this.stripeService.hasSubscription(customer)) {
      throw new BadRequestException('You already have a subscription');
    }

    return this.stripeService.createSubscription(customer, subscribeDto);
  }

  @Delete('cancel')
  @UseGuards(RequiredAuthGuard)
  @RateLimit({ every: minutes(1) })
  async cancel(@CurrentUser() user: User): Promise<Stripe.Subscription> {
    if (!user.payments.stripeId) {
      throw new BadRequestException('No customer');
    }

    const customer = await this.stripeService.getCustomer(
      user.payments.stripeId,
    );

    if (!customer.subscriptions) {
      throw new BadRequestException('No subscription');
    }

    return this.stripeService.cancelSubscription(
      customer.subscriptions.data[0],
    );
  }

  @Post('reenable')
  @UseGuards(RequiredAuthGuard)
  @RateLimit({ every: minutes(1) })
  async reenable(@CurrentUser() user: User): Promise<Stripe.Subscription> {
    if (!user.payments.stripeId) {
      throw new BadRequestException('No customer');
    }

    const customer = await this.stripeService.getCustomer(
      user.payments.stripeId,
    );

    if (!customer.subscriptions) {
      throw new BadRequestException('No subscription');
    }

    return this.stripeService.reenableSubscription(
      customer.subscriptions.data[0],
    );
  }
}
