import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import dotenv from 'dotenv';
import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import { initializePassport } from './config/passport.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT||8080;
const connection=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Conectado a MongoDB Atlas");
    }catch(err){
        console.error("Error conectado a MongoDB Atlas:",err);
    }
};
connection();

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

initializePassport();
app.use(passport.initialize());

app.use('/api/users',usersRouter);
app.use('/api/pets',petsRouter);
app.use('/api/adoptions',adoptionsRouter);
app.use('/api/sessions',sessionsRouter);

app.use((err, req, res, next)=>{
    console.error(err);
    res.status(500).send({status:"error", error: err.message});
});

app.listen(PORT,()=>console.log(`Listening on ${PORT}`))