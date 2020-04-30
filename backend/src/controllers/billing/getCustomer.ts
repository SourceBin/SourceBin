import { Request, Response } from 'express';

import { replyError } from '../../utils/errors';
import { createOrGetCustomer } from '../../utils/stripe';

export async function getCustomer(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new Error('User unavailable after authentication');
  }

  try {
    const customer = await createOrGetCustomer(req.user);

    res.json(customer);
  } catch (err) {
    console.error(err);

    replyError(500, 'Error fetching customer', res);
  }
}
