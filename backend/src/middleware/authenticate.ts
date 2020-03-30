import passport from 'passport';

export const requiredAuth = passport.authenticate('jwt', { session: false });
export const optionalAuth = passport.authenticate(['jwt', 'anonymous'], { session: false });
