import jwt from "jsonwebtoken";
import UserDTO from "../dto/User.dto.js";
import UserDTO from "../dto/User.dto.js";

const register=async(req,res)=>{
    try{
        res.send({status: "sucess", message: "User registered"});
    }catch(error){
        console.error("Error en register", error);
        res.status(500).send({status: "error", error: "Register failed"});
    }
};

const login=async(req,res)=>{
    try{
        if(req.user){
            return res.status(401).send({status:"error", error: "Invalid credentials"});
        }
        const UserDTO=UserDTO.getUserTokenFrom(req.user);
        const token=jwt.sign(UserDTO, "tokenSecretJWT",{ expiresIn: "1h"});
        res
            .cookie("coderCookie", token, {maxAge: 3600000, httpOnly: true})
            .send({status: "success", message:"Logged in"});
    }catch(error){
        console.error("Error en login:", error);
        res.status(500).send({status:"error", error: "Login gailed"});
    }
};

const current=asyn(req,res)=>{
    try{
        if(!req.user){
            return res.status(401).send({status: "error", error: "Not authenticated"});
            
        }
    }
}