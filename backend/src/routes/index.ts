import { Router } from 'express';

import bins from './bins';
import raw from './raw';

const router = Router();

router.get('/ping', (_, res) => res.send('Pong'));
router.use('/bins', bins);
router.use('/raw', raw);

export default router;
