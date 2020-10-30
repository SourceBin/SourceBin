import { Router } from 'express';

import { rateLimit } from '../middleware/rateLimit';
import { requiredAuth } from '../middleware/authenticate';

import { getUser } from '../controllers/user/getUser';
import { getBins } from '../controllers/user/getBins';

const router = Router();

router.get(
  '/',
  requiredAuth,
  rateLimit('user', 'get'),
  getUser,
);

router.get(
  '/bins',
  requiredAuth,
  rateLimit('user', 'bins'),
  getBins,
);

export default router;
