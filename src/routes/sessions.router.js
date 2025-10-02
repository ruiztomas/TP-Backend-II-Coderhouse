import { Router } from 'express';
import passport from 'passport';
import sessionsController from '../controllers/sessions.controller.js';

const router = Router();

router.post(
    '/register',
    sessionsController.register
);
router.post(
    '/login',
    sessionsController.login
);
router.get(
    '/current',
    sessionsController.current
);
router.post('/forgot-password',sessionsController.forgotPassword);
router.post('/reset-password', sessionsController.resetPassword);

router.post('/unprotected-login',sessionsController.unprotectedLogin);
router.get('/unprotected-current',sessionsController.unprotectedCurrent);

export default router;