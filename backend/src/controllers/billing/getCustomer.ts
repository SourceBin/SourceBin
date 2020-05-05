import { Request, Response } from 'express';

import { replyError } from '../../utils/errors';
import { getCustomer as getStripeCustomer } from '../../utils/stripe';

export async function getCustomer(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new Error('User unavailable after authentication');
  }

  if (!req.user.subscription.stripeId) {
    replyError(400, 'No customer', res);
    return;
  }

  try {
    const customer = await getStripeCustomer(req.user.subscription.stripeId);

    res.json(customer);
  } catch (err) {
    console.error(err);

    replyError(400, err.message, res);
  }
}
