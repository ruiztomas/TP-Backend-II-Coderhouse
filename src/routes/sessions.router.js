import { Router } from 'express';
import passport from 'passport';
import sessionsController from '../controllers/sessions.controller.js';

const router = Router();

router.post(
    '/register',
    passport.authenticate('register',{session: false}),
    sessionsController.register
);
router.post(
    '/login',
    passport.authenticate('login',{session: false}),
    sessionsController.login
);
router.get(
    '/current',
    passport.authenticate('jwt', {session: false}),
    sessionsController.current
);
router.get('/unprotectedLogin',sessionsController.unprotectedLogin);
router.get('/unprotectedCurrent',sessionsController.unprotectedCurrent);

export default router;