import { Request, Response } from 'express';

import { replyError } from '../../utils/errors';
import { stripe } from '../../utils/stripe';

export async function getUpcomingInvoice(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new Error('User unavailable after authentication');
  }

  if (!req.user.payments.stripeId) {
    replyError(400, 'No customer', res);
    return;
  }

  try {
    const invoice = await stripe.invoices.retrieveUpcoming({
      customer: req.user.payments.stripeId,
    });

    res.json(invoice);
  } catch (err) {
    console.error(err);

    replyError(400, err.message, res);
  }
}
