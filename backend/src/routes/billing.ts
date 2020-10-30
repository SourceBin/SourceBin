import { Router } from 'express';

import { rateLimit } from '../middleware/rateLimit';
import { jsonParser } from '../middleware/bodyParser';
import { requiredAuth } from '../middleware/authenticate';

import { getCustomer } from '../controllers/billing/getCustomer';
import { getPlan } from '../controllers/billing/getPlan';
import { getCoupon } from '../controllers/billing/getCoupon';
import { getUpcomingInvoice } from '../controllers/billing/getUpcomingInvoice';
import { subscribe } from '../controllers/billing/subscribe';
import { cancel } from '../controllers/billing/cancel';
import { reenable } from '../controllers/billing/reenable';

const router = Router();

router.get(
  '/customer',
  requiredAuth,
  rateLimit('billing', 'customer'),
  getCustomer,
);

router.get(
  '/plan/:plan',
  rateLimit('billing', 'plan'),
  getPlan,
);

router.get(
  '/coupon/:coupon',
  rateLimit('billing', 'coupon'),
  getCoupon,
);

router.get(
  '/upcoming-invoice/',
  rateLimit('billing', 'invoice'),
  requiredAuth,
  getUpcomingInvoice,
);

router.post(
  '/subscribe',
  requiredAuth,
  rateLimit('billing', 'subscribe'),
  jsonParser,
  subscribe,
);

router.delete(
  '/cancel',
  requiredAuth,
  rateLimit('billing', 'cancel'),
  cancel,
);

router.post(
  '/reenable',
  requiredAuth,
  rateLimit('billing', 'reenable'),
  reenable,
);

export default router;
