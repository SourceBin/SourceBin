import { Router } from 'express';
import bodyParser from 'body-parser';

import { rateLimits } from '../config';

import { rateLimit } from '../middleware/rateLimit';
import { jsonParser } from '../middleware/jsonParser';
import { requiredAuth } from '../middleware/authenticate';

import { getCustomer } from '../controllers/billing/getCustomer';
import { listPaymentMethods } from '../controllers/billing/listPaymentMethods';
import { addPaymentMethod } from '../controllers/billing/addPaymentMethod';
import { removePaymentMethod } from '../controllers/billing/removePaymentMethod';
import { getPlan } from '../controllers/billing/getPlan';
import { subscribe } from '../controllers/billing/subscribe';
import { cancel } from '../controllers/billing/cancel';
import { webhook } from '../controllers/billing/webhook';

const router = Router();

router.get(
  '/customer',
  requiredAuth,
  // TODO: ratelimit
  getCustomer,
);

router.get(
  '/payment-methods',
  requiredAuth,
  // TODO: ratelimit
  listPaymentMethods,
);

router.post(
  '/payment-method',
  requiredAuth,
  // TODO: ratelimit
  jsonParser,
  addPaymentMethod,
);

router.delete(
  '/payment-method',
  requiredAuth,
  // TODO: ratelimit
  jsonParser,
  removePaymentMethod,
);

router.get(
  '/plan/:plan',
  // TODO: ratelimit
  getPlan,
);

router.post(
  '/subscribe',
  requiredAuth,
  rateLimit(rateLimits.billing.subscribe),
  jsonParser,
  subscribe,
);

router.delete(
  '/cancel',
  requiredAuth,
  rateLimit(rateLimits.billing.cancel),
  cancel,
);

router.post(
  '/webook',
  // TODO: ratelimit
  bodyParser.raw({ type: 'application/json' }),
  webhook,
);

export default router;
