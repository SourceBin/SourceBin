import { Router } from 'express';

import { rateLimits } from '../config';

import { rateLimit } from '../middleware/rateLimit';
import { jsonParser } from '../middleware/jsonParser';

import { classify } from '../controllers/code/classify';

const router = Router();

router.post(
  '/classify',
  rateLimit(rateLimits.code.classify),
  jsonParser,
  classify,
);

export default router;
