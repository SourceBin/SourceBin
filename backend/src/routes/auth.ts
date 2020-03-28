import { Router } from 'express';
import passport from 'passport';

import { done } from '../controllers/auth/done';
import { logout } from '../controllers/auth/logout';

function authenticate(strategy: string): any {
  return passport.authenticate(strategy, {
    session: false,
    failureRedirect: '/account',
  });
}

const router = Router();

router.get('/discord', authenticate('discord'));
router.get('/discord/callback', authenticate('discord'), done);

router.get('/github', authenticate('github'));
router.get('/github/callback', authenticate('github'), done);

router.get('/logout', logout);

export default router;
