import { Router } from 'express';

import bins from './bins';

const router = Router();

router.use('/bins', bins);

export default router;
