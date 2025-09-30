import jwt from 'jsonwebtoken';

const SECRET=process.env.RESET_TOKEN_SECRET || process.env.JWT_SECRET || 'resetSecret';
const EXPIRES=parseInt(process.env.RESET_TOKEN_EXPIRES || '3600');

export const generateResetToken=(payload)=>{
    return jwt.sign(payload, SECRET, {expiresIn: EXPIRES});
};

export const verifyResetToken=(token)=>{
    try{
        return jwt.verify(token, SECRET);
    }catch(err){
        return null;
    }
};