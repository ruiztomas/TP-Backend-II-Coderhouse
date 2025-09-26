import { adoptionsService, petsService, usersService } from "../services/index.js"

const adoptionDTO=(adoption)=>({
    id: adoption._id,
    pet: adoption.pet,
    user:adoption.user,
    date:adoption.date
});

const getAllAdoptions = async(req,res)=>{
    try{ 
        const adoptions = await adoptionsService.getAll();
        res.send({status:"success",payload:adoptions});
    }catch(error){
        res.status(500).send({status:"error", error: error.message});
    }
};

const getAdoption = async(req,res)=>{
    try{ 
        const adoptionId = req.params.aid;
        const adoption = await adoptionsService.getBy(adoptionId);
        if(!adoption){
            return res.status(404).send({status:"error",error:"Adoption not found"})
        }
        res.send({status:"success",payload:adoption});
    }catch(error){
        res.status(500).send({status:"error", error: error.message});
    }
};

const createAdoption = async(req,res)=>{
    try{ 
        const {uid,pid} = req.params;
        const user = await usersService.getUserById(uid);
        if(!user){
            return res.status(404).send({status:"error", error:"user Not found"});
        }
        const pet = await petsService.getBy(pid);
        if(!pet){
            return res.status(404).send({status:"error",error:"Pet not found"});
        }
        if(pet.adopted){
            return res.status(400).send({status:"error",error:"Pet is already adopted"});
        }
        await petsService.update(pid,{adopted:true,owner:uid});
        const adoption=await adoptionsService.create({
            owner: uid,
            pet: pid,
            date: new Date()
        });
        res.send({status:"success",message:"Pet adopted"})
    }catch(error){
        res.status(500).send({status:"error", error: error.message});
    }
};

export default {
    createAdoption,
    getAllAdoptions,
    getAdoption
};