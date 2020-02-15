import { Router } from 'express';

import { rateLimits } from '../config';

import { rateLimit } from '../middleware/rateLimit';

import { getExternal } from '../controllers/external/getExternal';

const router = Router();

router.get(
  '/',
  rateLimit(rateLimits.external.get),
  getExternal,
);

export default router;
