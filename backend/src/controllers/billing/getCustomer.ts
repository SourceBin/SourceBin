import { Request, Response } from 'express';

import { replyError } from '../../utils/errors';
import { getCustomer as getStripeCustomer, createCustomer } from '../../utils/stripe';

export async function getCustomer(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new Error('User unavailable after authentication');
  }

  const { stripeId } = req.user.payments;

  try {
    let customer;

    if (stripeId) {
      customer = await getStripeCustomer(stripeId);
    } else {
      customer = await createCustomer(req.user);
    }

    res.json(customer);
  } catch (err) {
    console.error(err);

    replyError(400, err.message, res);
  }
}
