import { Router } from 'express';

import { rateLimits } from '../config';

import { rateLimit } from '../middleware/rateLimit';

import { getRaw } from '../controllers/raw/getRaw';

const router = Router();

router.get(
  '/:key/:fileIndex',
  rateLimit(rateLimits.bins.get),
  getRaw,
);

export default router;
