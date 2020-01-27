import { Router } from 'express';

import bins from './bins';

const router = Router();

router.get('/', (_, res) => res.send('API is up'));
router.use('/bins', bins);

export default router;
