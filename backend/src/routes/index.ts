import { Router } from 'express';

import auth from './auth';
import bins from './bins';
import raw from './raw';

const router = Router();

router.get('/ping', (_, res) => res.send('Pong'));

router.use('/auth', auth);
router.use('/bins', bins);
router.use('/raw', raw);

export default router;
