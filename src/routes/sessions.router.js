import { Router } from 'express';
import passport from 'passport';
import {authorization} from "../middlewares/authorization.js"
import sessionsController from '../controllers/sessions.controller.js';

const router = Router();

router.post(
    '/register',
    passport.authenticate('register',{session:false}),
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
router.post('/forgot-password',sessionsController.forgotPassword);
router.post('/reset-password', sessionsController.resetPassword);

router.post('/unprotected-login',sessionsController.unprotectedLogin);
router.get('/unprotected-current',sessionsController.unprotectedCurrent);

export default router;