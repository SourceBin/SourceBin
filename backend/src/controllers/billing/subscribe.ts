import { Request, Response } from 'express';

import { replyError } from '../../utils/errors';
import {
  stripe, getCustomer, createCustomer, hasSubscription,
} from '../../utils/stripe';

export async function subscribe(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new Error('User unavailable after authentication');
  }

  const { stripeId } = req.user.subscription;

  if (stripeId) {
    try {
      await stripe.paymentMethods.attach(req.body.paymentMethod, {
        customer: stripeId,
      });
    } catch (err) {
      console.error(err);

      replyError(400, err.message, res);
      return;
    }
  }

  let customer;
  try {
    if (stripeId) {
      customer = await getCustomer(stripeId);
    } else {
      customer = await createCustomer(req.user, req.body.paymentMethod);
    }
  } catch (err) {
    console.error(err);

    replyError(400, err.message, res);
    return;
  }

  if (hasSubscription(customer)) {
    replyError(400, 'You already have a subscription', res);
    return;
  }

  try {
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ plan: req.body.plan }],
      coupon: req.body.coupon,
      expand: ['latest_invoice.payment_intent'],
      // eslint-disable-next-line @typescript-eslint/camelcase
      default_payment_method: req.body.paymentMethod,
    });

    res.json(subscription);
  } catch (err) {
    console.error(err);

    replyError(400, err.message, res);
  }
}
