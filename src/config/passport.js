import passport from 'passport';
import local from 'passport-local';
import { Strategy as JWStrategy, ExtractJwt } from 'passport-jwt';
import { usersService } from '../services/index.js';
import { createHash, passwordValidation } from '../utils/index.js';

const LocalStrategy=local.Strategy;

export const initializePassport=()=>{
    passport.use('login', new LocalStrategy(
        {usernameField: 'email'},
        async(email, password, done)=>{
            try{
                const user=await usersService.getUserByEmail(email);
                if(!user)return done(null, false, {message:"User doesn't exist"});

                const isValid=await passwordValidation(user, password);
                if(!isValid)return done(null,false,{message: 'Incorrect password'});

                return done(null, user);
            }catch(err){
                return done(err);
            }
        }
    ));
    passport.use('jwt', new JWStrategy(
        {
            jwtFromRequest: ExtractJwt.fromExtractors([(req)=>req?.cookies?.coderCookie || null]),
            secretOrKey: process.env.JWT_SECRET || 'tokenSecretJWT'
        },
        async(jwt_payload, done)=>{
            try{
                const user=await usersService.getBy({_id: jwt_payload.id});
                if(!user)return done(null, false);
                return done(null, user);
            }catch(err){
                return done(err);
            }
        }
    ));
};