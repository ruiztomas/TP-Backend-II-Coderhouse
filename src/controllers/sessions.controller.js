import {usersService}from "../services/index.js";
import {createHash, passwordValidation} from "../utils/index.js";
import jwt from "jsonwebtoken";
import UserDTO from "../dto/User.dto.js";

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
        let result=await usersService.create(user);
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
        const token=jwt.sign(userToken, process.env.JKWT_SECRET ||  "tokenSecretJWT",{ expiresIn: "1h"});
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
        if(!req.user){
            return res.status(401).send({status: "error", error: "Not authenticated"});
        }
        res.send({status: "success", payload: req.user});
    }catch(error){
        console.error("Error en current:", error);
        res.status(500).send({status: "error", error: "Failed to get current user"});
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

    const token=jwt.sign(user, "tokenSecretJWT",{expiresIn:"1h"});

    res
        .cookie("unprotectedCookie", token, {maxAge: 3600000})
        .send({status:"success", message:"Unprotected Logged in"});
};

const unprotectedCurrent=async(req,res)=>{
    const cookie=req.cookies["unprotectedCookie"];
    const user=jwt.verify(cookie, "tokenSecretJWT");
    if(user)return res.send({status:"success",payload: user});
};

export default{
    register,
    login,
    current,
    unprotectedLogin,
    unprotectedCurrent
};