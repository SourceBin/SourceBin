import { Request, Response } from 'express';

import { replyError } from '../../utils/errors';
import { stripe } from '../../utils/stripe';

export async function listPaymentMethods(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new Error('User unavailable after authentication');
  }

  if (!req.user.subscription.stripeId) {
    replyError(400, 'No customer', res);
    return;
  }

  try {
    const paymentMethods = await stripe.paymentMethods.list(
      { customer: req.user.subscription.stripeId, type: 'card' },
    );

    res.json(paymentMethods);
  } catch (err) {
    console.error(err);

    replyError(500, 'Error fetching payment methods', res);
  }
}
