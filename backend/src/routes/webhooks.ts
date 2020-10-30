import { Router } from 'express';
import bodyParser from 'body-parser';

import { rateLimit } from '../middleware/rateLimit';

import { stripeWebhook } from '../controllers/webhooks/stripe';

const router = Router();

router.post(
  '/stripe',
  rateLimit('webhooks', 'stripe'),
  bodyParser.raw({ type: 'application/json' }),
  stripeWebhook,
);

export default router;
