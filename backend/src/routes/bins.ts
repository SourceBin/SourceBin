import { Router } from 'express';

import { rateLimits } from '../config';

import { rateLimit } from '../middleware/rateLimit';
import { jsonParser } from '../middleware/jsonParser';
import { requiredAuth, optionalAuth } from '../middleware/authenticate';

import { getBin } from '../controllers/bins/getBin';
import { createBin } from '../controllers/bins/createBin';
import { disownBin } from '../controllers/bins/disownBin';
import { listBins } from '../controllers/bins/listBins';

const KEY_PATTERN = '[0-9a-fA-F]{10}';

const router = Router();

router.get(
  `/:key(${KEY_PATTERN})`,
  rateLimit(rateLimits.bins.get),
  getBin,
);

router.post(
  '/',
  optionalAuth,
  rateLimit(rateLimits.bins.create),
  jsonParser,
  createBin,
);

router.delete(
  `/:key(${KEY_PATTERN})`,
  requiredAuth,
  rateLimit(rateLimits.bins.delete),
  disownBin,
);

router.get(
  '/list',
  requiredAuth,
  rateLimit(rateLimits.bins.list),
  listBins,
);

export default router;
