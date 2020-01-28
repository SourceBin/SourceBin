import { Router } from 'express';

import bins from './bins';

const router = Router();

router.get('/ping', (_, res) => res.send('Pong'));
router.use('/bins', bins);

export default router;
