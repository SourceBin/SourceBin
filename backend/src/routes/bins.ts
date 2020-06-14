import { Router } from 'express';

import { rateLimits } from '../config';

import { rateLimit } from '../middleware/rateLimit';
import { jsonParserProLimit } from '../middleware/bodyParser';
import { requiredAuth, optionalAuth } from '../middleware/authenticate';

import { getBin } from '../controllers/bins/getBin';
import { createBin } from '../controllers/bins/createBin';
import { disownBin } from '../controllers/bins/disownBin';

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
  jsonParserProLimit('0.1MB', '5MB'),
  createBin,
);

router.delete(
  `/:key(${KEY_PATTERN})`,
  requiredAuth,
  rateLimit(rateLimits.bins.disown),
  disownBin,
);

export default router;
