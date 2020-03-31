import { Router } from 'express';

import { rateLimits } from '../config';

import { rateLimit } from '../middleware/rateLimit';
import { requiredAuth } from '../middleware/authenticate';

import { getUser } from '../controllers/user/getUser';

const router = Router();

router.get(
  '/',
  requiredAuth,
  rateLimit(rateLimits.user.get),
  getUser,
);

export default router;
