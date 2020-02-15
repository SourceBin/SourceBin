import { Router } from 'express';

import bins from './bins';
import external from './external';

const router = Router();

router.get('/ping', (_, res) => res.send('Pong'));
router.use('/bins', bins);
router.use('/external', external);

export default router;
