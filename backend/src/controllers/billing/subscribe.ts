import { Request, Response } from 'express';

import { replyError } from '../../utils/errors';
import { stripe, getCustomer, hasSubscription } from '../../utils/stripe';

export async function subscribe(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new Error('User unavailable after authentication');
  }

  if (!req.user.subscription.stripeId) {
    replyError(400, 'No customer', res);
    return;
  }

  try {
    const customer = await getCustomer(req.user.subscription.stripeId);

    if (hasSubscription(customer)) {
      replyError(400, 'Customer already has a subscription', res);
      return;
    }

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ plan: req.body.plan }],
      expand: ['latest_invoice.payment_intent'],
      // eslint-disable-next-line @typescript-eslint/camelcase
      default_payment_method: req.body.paymentMethod,
    });

    res.json(subscription);
  } catch (err) {
    console.error(err);

    replyError(500, 'Error creating subscription', res);
  }
}
