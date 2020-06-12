import { Request, Response } from 'express';

import { replyError } from '../../utils/errors';
import { stripe, planNameToId } from '../../utils/stripe';

export async function getPlan(req: Request, res: Response): Promise<void> {
  const planId = planNameToId(req.params.plan);

  if (!planId) {
    replyError(400, 'Invalid plan', res);
    return;
  }

  try {
    const plan = await stripe.plans.retrieve(planId);

    res.json(plan);
  } catch (err) {
    console.error(err);

    replyError(400, err.message, res);
  }
}
