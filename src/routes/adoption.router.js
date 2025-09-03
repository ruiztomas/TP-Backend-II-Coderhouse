import { Router} from 'express';
import passport from 'passport';
import { authorization } from '../middlewares/authorization.js';
import adoptionsController from '../controllers/adoptions.controller.js';

const router = Router();

router.get(
    '/',
    passport.authenticate('jwt',{session: false}),
    authorization(['admin']),
    adoptionsController.getAllAdoptions
);
router.get(
    '/:aid',
    passport.authenticate('jwt',{session:false}),
    authorization(['admin']),
    adoptionsController.getAdoption
);
router.post(
    '/:uid/:pid',
    passport.authenticate('jwt', {session:false}),
    authorization(['user','admin']),
    adoptionsController.createAdoption
);

export default router;