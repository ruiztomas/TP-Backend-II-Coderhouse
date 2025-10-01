import passport from 'passport';
import local from 'passport-local';
import { Strategy as JWStrategy, ExtractJwt } from 'passport-jwt';
import { usersService } from '../services/index.js';
import { createHash, passwordValidation } from '../utils/index.js';

const LocalStrategy=local.Strategy;

export const initializePassport=()=>{
    passport.use('register', new LocalStrategy(
        {usernameField: 'email', passReqToCallback: true},
        async (req, email, password, done)=>{
            try{
                const{first_name, last_name, role}=req.body;
                if(!first_name || !last_name || !email || !password){
                    return done(null, false,{message: "Incomplete values"});
                }
                const userExists=await usersService.getUserByEmail(email);
                if(userExists){
                    return done(null, false, {message:'User already exists'});
                }
                const hashedPassword=await createHash(password);
                const newUser={
                    first_name,
                    last_name,
                    email,
                    password: hashedPassword,
                    role: role || 'user'
                };
                const result=await usersService.create(newUser);
                return done(null, result);
            }catch(err){
                return done('Error registering user:'+err);
            }
        }
    ));
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