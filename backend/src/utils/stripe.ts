import Stripe from 'stripe';

import { User, UserModel } from '../models/User';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2020-03-02',
});

export async function getCustomer(id: string): Promise<Stripe.Customer> {
  const customer = await stripe.customers.retrieve(id);

  if (customer.deleted) {
    throw new Error('Customer is deleted');
  } else {
    return customer as Stripe.Customer;
  }
}

export async function createOrGetCustomer(user: User): Promise<Stripe.Customer> {
  if (user.subscription.stripeId) {
    return getCustomer(user.subscription.stripeId);
  }

  const customer = await stripe.customers.create({
    email: user.email,
  });

  user.subscription.stripeId = customer.id; // eslint-disable-line no-param-reassign
  await user.save();

  return customer;
}

export function hasSubscription(customer: Stripe.Customer): boolean {
  return customer.subscriptions
    ? customer.subscriptions.data.length >= 1
    : false;
}

export async function updateSubscription(invoice: Stripe.Invoice): Promise<void> {
  const purchase = invoice.lines.data[0];

  if (!purchase || !purchase.plan || typeof purchase.plan.product !== 'string') {
    throw new Error('Unknown purchase or plan');
  }

  const product = await stripe.products.retrieve(purchase.plan.product);

  await UserModel
    .updateOne(
      { 'subscription.stripeId': invoice.customer },
      { 'subscription.plan': product.name },
    )
    .exec();
}

export async function deleteSubscription(subscription: Stripe.Subscription): Promise<void> {
  await UserModel
    .updateOne(
      { 'subscription.stripeId': subscription.customer },
      { 'subscription.plan': 'Free' },
    )
    .exec();
}
