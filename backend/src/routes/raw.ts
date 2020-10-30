import { Router } from 'express';

import { rateLimit } from '../middleware/rateLimit';

import { getRaw } from '../controllers/raw/getRaw';

const router = Router();

router.get(
  '/:key/:fileIndex',
  rateLimit('bins', 'get'),
  getRaw,
);

export default router;
