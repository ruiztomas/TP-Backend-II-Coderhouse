import { Router } from 'express';
import passport from 'passport';
import { authorization } from '../middlewares/authorization.js';
import petsController from '../controllers/pets.controller.js';
import uploader from '../utils/uploader.js';

const router = Router();

router.get('/',petsController.getAllPets);
router.post(
    '/',
    passport.authenticate('jwt',{session:false}),
    authorization('admin'),
    petsController.createPet
);
router.post(
    '/withimage',
    passport.authenticate('jwt',{session:false}),
    authorization(['admin']),
    uploader.single('image'),
    petsController.createPetWithImage
);
router.put(
    '/:pid',
    passport.authenticate('jwt',{session:false}),
    authorization('admin'),
    petsController.updatePet
);
router.delete(
    '/:pid',
    passport.authenticate('jwt',{session:false}),
    authorization('admin'),
    petsController.deletePet
);

export default router;