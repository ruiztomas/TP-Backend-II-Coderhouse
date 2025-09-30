import {usersService}from "../services/index.js";
import {createHash, passwordValidation} from "../utils/index.js";
import jwt from "jsonwebtoken";
import UserDTO from "../dto/User.dto.js";
import transporter from "../utils/mailer.js";
import {generateResetToken, verifyResetToken} from "../utils/tokenReset.js";

const register=async(req,res)=>{
    try{
        const{first_name, last_name, email, password, role}=req.body;
        if(!first_name || !last_name || !email || !password)
            return res.status(400).send({status: "error", error:"Incomplete values"});
        const exists=await usersService.getUserByEmail(email);
        if(exists)
            return res.status(400).send({status:"error", error:"User already exists"});
        const hashedPassword=await createHash(password);
        const user={first_name, last_name, email, password: hashedPassword, role:role || "user"};
        const result=await usersService.create(user);
        res.send({status:"success", payload:result._id});
    }catch(error){
        res.status(500).send({status:"error", error:error.message});
    }
};

const login=async(req,res)=>{
    try{
        if(!req.user){
            return res.status(401).send({status:"error", error: "Invalid credentials"});
        }
        const userToken=UserDTO.getUserTokenFrom(req.user);
        const token=jwt.sign(userToken, process.env.JWT_SECRET ||  "tokenSecretJWT",{ expiresIn: "1h"});
        res
            .cookie("coderCookie", token, {maxAge: 3600000, httpOnly: true})
            .send({status: "success", message:"Logged in"});
    }catch(error){
        console.error("Error en login:", error);
        res.status(500).send({status:"error", error: "Login gailed"});
    }
};

const current=async(req,res)=>{
    try{
        if(!req.user)
            return res.status(401).send({status: "error", error: "Not authenticated"});
        const dto=UserDTO.getUserTokenFrom(req.user);
        res.send({status: "success", payload: dto});
    }catch(error){
        console.error("Error en current:", error);
        res.status(500).send({status: "error", error: "Failed to get current user"});
    }
};

const forgotPassword=async(req, res)=>{
    try{
        const {email}=req.body;
        if(!email) return res.status(400).send({status: "error", error: "Email required"});
        const user=await usersService.getUserByEmail(email);
        if(!user){
            return res.send({status: "succcess", message: "If the email exists, a reset link was sent"});
        }
        const token=generateResetToken({id: user._id, email: user.email});
        const expiresAt=Date.now()+(parseInt(process.env.RESET_TOKEN_EXPIRES || "3600")*1000);
        await usersService.update(user._id, {resetPasswordToken: token, resetPasswordExpires: new Date(expiresAt)});
        const resetLink=`${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
        await transporter.sendMail({
            from: `"Petshop" <${process.env.MAIL_USER}>`,
            to: user.email,
            subject:"Reset your password",
            html:`
                <p>Hiciste una solicitud para restablecer tu contraseña. El enlace expira en 1 hora.</p>
                <p><a href="${resetLink}" style="
                    display=inline-block;
                    padding:10px 18px;
                    background:#1a73e8;
                    color:#fff;
                    border-radius:6px;
                    text-decoration:none;
                    ">Restablecer contraseña</a></p>
                <p>Si no solicitaste esto, ignora este correo.</p>
            `
        });
        return res.send({status:"success", message:"If the email exists, a reset link was sent"});
    }catch(error){
        console.error("forgotPassword error:", error);
        res.status(500).send({status:"error", error:"Failed to process forgot password"});
    }
};

const resetPassword=async(req,res)=>{
    try{
        const{token, newPassword}=req.body;
        if(!token || !newPassword)return res.status(400).send({status:"error", error:"Token and new password are required"});
        const payload=verifyResetToken(token);
        if(!payload)return res.status(400).send({status:"error", error:"Invalid or expired token"});
        const user=await usersService.getBy({_id: payload.id});
        if(!user)return res.status(404).send({status:"error", error:"User not found"});
        if(!user.resetPasswordToken || user.resetPasswordToken !==token || !user.resetPasswordExpires || Date.now()>new Date(user.resetPasswordExpires).getTime()){
            return res.status(400).send({status:"error", error:"Invalid or expired token"});
        }
        const sameAsOld=await passwordValidation(user, newPassword);
        if(sameAsOld)return res.status(400).send({status: "error", error:"New password cannot be the same as the previous one"});
        const hashed=await createHash(newPassword);
        await usersService.update(user._id, {password: hashed, resetPasswordToken:null, resetPasswordExpires: null});
        return res.send({status:"success", message:"Password updated successfully"});
    }catch(error){
        console.error("resetPassword error:", error);
        res.status(500).send({status:"error", error:"Failed to reset password"});
    }   
};

const unprotectedLogin=async(req, res)=>{
    const {email, password}=req.body;
    if(!email || !password)
        return res.status(400).send({status: "error", error: "Incomplete values"});

    const user=await usersService.getUserByEmail(email);
    if(!user)return res.status(404).send({status:"error",error: "User doesn't exist"});

    const isValidPassword=await passwordValidation(user, password);
    if(!isValidPassword)
        return res.status(404).send({status: "error", error:"Incorrect password"});

    const token=jwt.sign(UserDTO.getUserTokenFrom(user),process.env.JWT_SECRET || "tokenSecretJWT",{expiresIn:"1h"});

    res
        .cookie("unprotectedCookie", token, {maxAge: 3600000})
        .send({status:"success", message:"Unprotected Logged in"});
};

const unprotectedCurrent=async(req,res)=>{
    try{ 
        const cookie=req.cookies["unprotectedCookie"];
        if(!cookie)return res.status(401).send({status:"error", error:"No cookie"});
        const user=jwt.verify(cookie, process.env.JWT_SECRET || "tokenSecretJWT");
        if(user)return res.send({status:"success",payload: user});
        res.status(401).send({status:"error", error:"Invalid token"});
    }catch(err){
        res.status(401).send({status:"error", error:"Invalid token"});
    }
};

export default{
    register,
    login,
    current,
    forgotPassword,
    resetPassword,
    unprotectedLogin,
    unprotectedCurrent
};