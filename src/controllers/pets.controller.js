import PetDTO from "../dto/Pet.dto.js";
import { petsService } from "../services/index.js"
import __dirname from "../utils/index.js";

const getAllPets = async(req,res)=>{
    try{
        const pets = await petsService.getAll();
        res.send({status: "success",payload:pets});
    }catch(err){
        res.status(500).send({status:"error",error:err.message});
    }
};

const createPet = async(req,res)=> {
    try{ 
        const {name,specie,birthDate} = req.body;
        if(!name||!specie||!birthDate) {
            return res
                .status(400)
                .send({status:"error",error:"Incomplete values"});
        }
        const birth=new Date(birthDate);
        if(isNaN(birth.getTime())){
            return res
                .status(400)
            .   send({status:"error", error:"Invalid birthDate"});
        }
        const pet = PetDTO.getPetInputFrom({name,specie,birthDate: birth});
        const result = await petsService.create(pet);
        res.send({status:"success",payload:result})
    }catch(err){
        res.status(500).send({status:"error",error:err.message});
    }   
};

const updatePet = async(req,res) =>{
    try{
        const petUpdateBody = req.body;
        const petId = req.params.pid;
        if(petUpdateBody.birthDate){
            const birth=new Date(petUpdateBody.birthDate);
            if(isNaN(birth.getTime())){
                return res
                    .status(400)
                    .send({status:"error",error:"Invalid birthDate"});
            }
        }
        const result = await petsService.update(petId,petUpdateBody);
        if(!result){
            return res
                .status(404)
                .send({status:"error",error:"Pet not found"});
        }
        res.send({status:"success",message:"Pet updated",patyload:result});
    }catch(err){
        res.status(500).send({status:"error", error: err.message});
    }
};

const deletePet = async(req,res)=> {
    try{
        const petId = req.params.pid;
        const result=await petsService.delete(petId);
        if(!result){
            return res
                .status(404)
                .send({status:"success", message:"Pet not found"});
        }
        res.send({status:"success",message:"Pet deleted"});
    }catch(err){
        res.status(500).send({status:"error", error: err.message});
    }
};

const createPetWithImage = async(req,res) =>{
    try{
        const file = req.file;
        const {name,specie,birthDate} = req.body;
        if(!name||!specie||!birthDate||!file){ 
            return res
                .status(400)
                .send({status:"error",error:"Incomplete values"});
        }
        const birth=new Date(birthDate);
        if(isNaN(birth.getTime())){ 
            return res
                .status(400)
                .send({status:"error", error:"Invalid birthDate"});
        }
        const pet = PetDTO.getPetInputFrom({
            name,
            specie,
            birthDate: birth,
            image:`${__dirname}/../public/img/${file.filename}`
        });
        const result = await petsService.create(pet);
        res.send({status:"success",payload:result})
    }catch(err){
        res.status(500).send({status:"error", error: err.message});
    }
};
export default {
    getAllPets,
    createPet,
    updatePet,
    deletePet,
    createPetWithImage
}