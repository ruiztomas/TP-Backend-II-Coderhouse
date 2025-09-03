import { Router } from 'express';
import passport from 'passport';
import { authorization } from '../middlewares/authorization.js';
import usersController from '../controllers/users.controller.js';

const router = Router();

router.get(
    '/',
    passport.authenticate('jwt', {session:false}),
    authorization(['admin']),
    usersController.getAllUsers
);
router.get(
    '/:uid',
    passport.authenticate('jwt',{session:false}),
    authorization(['admin']),
    usersController.getUser
);
router.put(
    '/:uid',
    passport.authenticate('jwt',{session:false}),
    authorization(['admin']),
    usersController.updateUser
);
router.delete(
    '/:uid',
    passport.authenticate('jwt',{session:false}),
    authorization(['admin']),
    usersController.deleteUser
);

export default router;