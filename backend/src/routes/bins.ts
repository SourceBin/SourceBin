import { Router } from 'express';

import { jsonParser } from '../middleware/jsonParser';

import { getBin } from '../controllers/bins/getBin';
import { createBin } from '../controllers/bins/createBin';

const router = Router();

router.get('/:key', getBin);
router.post('/', jsonParser, createBin);

export default router;
