import { Router } from 'express';
import passport from 'passport';

import { authenticated } from '../controllers/auth/authenticated';
import { logout } from '../controllers/auth/logout';

function authenticate(strategy: string): any {
  return passport.authenticate(strategy, {
    session: false,
    failureRedirect: '/account',
  });
}

const router = Router();

router.get('/discord', authenticate('discord'));
router.get('/discord/callback', authenticate('discord'), authenticated);

router.get('/github', authenticate('github'));
router.get('/github/callback', authenticate('github'), authenticated);

router.get('/logout', logout);

export default router;
