import { Router } from 'express';

import { rateLimits } from '../config';

import { rateLimit } from '../middleware/rateLimit';
import { jsonParser } from '../middleware/jsonParser';

import { getBin } from '../controllers/bins/getBin';
import { createBin } from '../controllers/bins/createBin';

const router = Router();

router.get(
  '/:key',
  rateLimit(rateLimits.bins.get),
  getBin,
);

router.post(
  '/',
  rateLimit(rateLimits.bins.create),
  jsonParser,
  createBin,
);

export default router;
