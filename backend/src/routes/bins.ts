import { Router } from 'express';

import { jsonParser } from '../middleware/jsonParser';
import { createBin } from '../controllers/bins/createBin';

const router = Router();

router.post('/create', jsonParser, createBin);

export default router;
