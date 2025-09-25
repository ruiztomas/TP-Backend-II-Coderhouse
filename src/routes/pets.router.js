import { Router } from 'express';
import passport, { authenticate } from 'passport';
import {authotization} from '../middlewares/authorization.js';
import petsController from '../controllers/pets.controller.js';
import uploader from '../utils/uploader.js';

const router = Router();

router.get('/',petsController.getAllPets);
router.post(
    '/',
    passport.authenticate('jwt',{session:false}),
    authotization('admin'),
    petsController.createPet
);
router.post(
    '/withimage',
    passport.authenticate('jwt',{session:false}),
    uploader.single('image'),
    petsController.createPetWithImage
);
router.put(
    '/:pid',
    passport.authenticate('jwt',{session:false}),
    authotization('admin'),
    petsController.updatePet
);
router.delete(
    '/:pid',
    passport.authenticate('jwt',{session:false}),
    authotization('admin'),
    petsController.deletePet
);

export default router;