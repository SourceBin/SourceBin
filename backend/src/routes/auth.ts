import { Router } from 'express';

import { registerOrLogin, registerOrLoginCallback } from '../middleware/registerOrLogin';

import { authenticated } from '../controllers/auth/authenticated';
import { logout } from '../controllers/auth/logout';

const router = Router();

router.get('/discord', registerOrLogin('discord'));
router.get('/discord/callback', registerOrLoginCallback('discord'), authenticated);

router.get('/github', registerOrLogin('github'));
router.get('/github/callback', registerOrLoginCallback('github'), authenticated);

router.get('/logout', logout);

export default router;
