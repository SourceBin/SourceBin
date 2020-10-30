import { Router } from 'express';

import { rateLimit } from '../middleware/rateLimit';
import { requiredAuth } from '../middleware/authenticate';
import { jsonParserProLimit } from '../middleware/bodyParser';

import { getBin } from '../controllers/bins/getBin';
import { createBin } from '../controllers/bins/createBin';
import { disownBin } from '../controllers/bins/disownBin';

const KEY_PATTERN = '[0-9a-zA-Z]{10}';

const router = Router();

router.get(
  `/:key(${KEY_PATTERN})`,
  rateLimit('bins', 'get'),
  getBin,
);

router.post(
  '/',
  rateLimit('bins', 'create'),
  jsonParserProLimit('0.1MB', '5MB'),
  createBin,
);

router.delete(
  `/:key(${KEY_PATTERN})`,
  requiredAuth,
  rateLimit('bins', 'disown'),
  disownBin,
);

export default router;
