import { Request, Response } from 'express';

import { replyError } from '../../utils/errors';
import { stripe } from '../../utils/stripe';

export async function getCoupon(req: Request, res: Response): Promise<void> {
  try {
    const coupon = await stripe.coupons.retrieve(req.params.coupon);

    res.json(coupon);
  } catch (err) {
    replyError(400, err.message, res);
  }
}
