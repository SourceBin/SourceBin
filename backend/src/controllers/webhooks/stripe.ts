import { Request, Response } from 'express';
import Stripe from 'stripe';

import { stripe, updateSubscription, deleteSubscription } from '../../utils/stripe';

export async function stripeWebhook(req: Request, res: Response): Promise<void> {
  const signature = req.headers['stripe-signature'];

  if (!signature) {
    res.status(400).end();
    return;
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET || '');
  } catch (err) {
    console.error(err.message);

    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  switch (event.type) {
    case 'invoice.payment_succeeded':
      await updateSubscription(event.data.object as Stripe.Invoice);
      break;
    case 'customer.subscription.deleted':
      await deleteSubscription(event.data.object as Stripe.Subscription);
      break;
    default:
      res.status(400).end('Webhook Error: Unexpected event type');
      return;
  }

  res.status(200).end();
}
