import { Router } from 'express';

import { rateLimit } from '../middleware/rateLimit';
import { jsonParser } from '../middleware/bodyParser';

import { classify } from '../controllers/code/classify';

const router = Router();

router.post(
  '/classify',
  rateLimit('code', 'classify'),
  jsonParser,
  classify,
);

export default router;
