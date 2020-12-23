import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Stripe from 'stripe';

import { stripeConfig } from '../../configs';
import { SubscribeDto } from '../../routes/billing/dto/subscribe.dto';
import { Plan, User, UserDocument } from '../../schemas/user.schema';

@Injectable()
export class StripeService {
  private readonly stripe = new Stripe(stripeConfig.KEY, {
    apiVersion: '2020-08-27',
  });

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  planToId(name: string): string | undefined {
    switch (name) {
      case 'pro_monthly':
        return stripeConfig.PRO_MONTHLY;
      case 'pro_yearly':
        return stripeConfig.PRO_YEARLY;
      default:
        return undefined;
    }
  }

  async getCustomer(id: string): Promise<Stripe.Customer> {
    const customer = await this.stripe.customers.retrieve(id, {
      expand: ['subscriptions.data.default_payment_method'],
    });

    if (customer.deleted) {
      throw new Error('Customer is deleted');
    }

    return customer;
  }

  async createCustomer(
    user: User,
    paymentMethod?: string,
  ): Promise<Stripe.Customer> {
    const customer = await this.stripe.customers.create({
      payment_method: paymentMethod,
      email: user.email,
    });

    user.payments.stripeId = customer.id;
    await this.userModel
      .updateOne({ _id: user._id }, { 'payments.stripeId': customer.id })
      .exec();

    return customer;
  }

  getOrCreateCustomer(
    user: User,
    paymentMethod?: string,
  ): Promise<Stripe.Customer> {
    return user.payments.stripeId
      ? this.getCustomer(user.payments.stripeId)
      : this.createCustomer(user, paymentMethod);
  }

  async getPlan(plan: string): Promise<Stripe.Plan | undefined> {
    const id = this.planToId(plan);

    if (!id) {
      return undefined;
    }

    return this.stripe.plans.retrieve(id);
  }

  getCoupon(coupon: string): Promise<Stripe.Coupon> {
    return this.stripe.coupons.retrieve(coupon);
  }

  async getUpcomingInvoice(id: string): Promise<Stripe.Invoice> {
    return this.stripe.invoices.retrieveUpcoming({
      customer: id,
    });
  }

  attachPaymentMethod(
    id: string,
    paymentMethod: string,
  ): Promise<Stripe.PaymentMethod> {
    return this.stripe.paymentMethods.attach(paymentMethod, {
      customer: id,
    });
  }

  hasSubscription(customer: Stripe.Customer): boolean {
    const subscriptions = customer.subscriptions?.data.length;
    return !!subscriptions && subscriptions >= 1;
  }

  createSubscription(
    customer: Stripe.Customer,
    subscribeDto: SubscribeDto,
  ): Promise<Stripe.Subscription> {
    return this.stripe.subscriptions.create({
      customer: customer.id,
      items: [{ plan: subscribeDto.plan }],
      coupon: subscribeDto.coupon,
      expand: ['latest_invoice.payment_intent'],
      default_payment_method: subscribeDto.paymentMethod,
    });
  }

  cancelSubscription(
    subscription: Stripe.Subscription,
  ): Promise<Stripe.Subscription> {
    return this.stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: true,
    });
  }

  reenableSubscription(
    subscription: Stripe.Subscription,
  ): Promise<Stripe.Subscription> {
    return this.stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: false,
    });
  }

  constructEvent(payload: string, signature: string): Stripe.Event {
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      stripeConfig.WEBHOOK_SECRET,
    );
  }

  async updateSubscription(invoice: Stripe.Invoice): Promise<void> {
    const purchase = invoice.lines.data[0];

    if (typeof purchase?.plan?.product !== 'string') {
      throw new Error('Unknown purchase or plan');
    }

    const product = await this.stripe.products.retrieve(purchase.plan.product);

    await this.userModel
      .updateOne(
        { 'payments.stripeId': invoice.customer },
        { plan: product.name as Plan },
      )
      .exec();
  }

  async deleteSubscription(subscription: Stripe.Subscription): Promise<void> {
    await this.userModel
      .updateOne(
        { 'payments.stripeId': subscription.customer },
        { plan: Plan.FREE },
      )
      .exec();
  }
}
