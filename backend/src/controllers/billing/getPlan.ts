import { Request, Response } from 'express';

import { replyError } from '../../utils/errors';
import { stripe } from '../../utils/stripe';

export async function getPlan(req: Request, res: Response): Promise<void> {
  try {
    const plan = await stripe.plans.retrieve(req.params.plan);

    res.json(plan);
  } catch (err) {
    console.error(err);

    replyError(500, 'Error fetching plan', res);
  }
}
