import { Request, Response } from 'express';

import { replyError } from '../../utils/errors';
import { stripe } from '../../utils/stripe';

export async function addPaymentMethod(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new Error('User unavailable after authentication');
  }

  if (!req.user.subscription.stripeId) {
    replyError(400, 'No customer', res);
    return;
  }

  try {
    const paymentMethod = await stripe.paymentMethods.attach(
      req.body.paymentMethod,
      { customer: req.user.subscription.stripeId },
    );

    res.json(paymentMethod);
  } catch (err) {
    console.error(err);

    replyError(500, 'Error adding payment method', res);
  }
}
