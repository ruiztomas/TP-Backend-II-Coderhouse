import PetDTO from "../dto/Pet.dto.js";
import { petsService } from "../services/index.js"
import __dirname from "../utils/index.js";

const getAllPets = async(req,res)=>{
    const pets = await petsService.getAll();

    res.send({status:"success",payload:pets})
}

const createPet = async(req,res)=> {
    const {name,specie,birthDate} = req.body;
    if(!name||!specie||!birthDate) 
        return res.status(400).send({status:"error",error:"Incomplete values"});
    const birth=new Date(birthDate);
    if(isNaN(birth.getTime()))
        return res.status(400).send({status:"error", error:"Invalid birthDate"});
    const pet = PetDTO.getPetInputFrom({name,specie,birthDate: birth});
    const result = await petsService.create(pet);
    res.send({status:"success",payload:result})
}

const updatePet = async(req,res) =>{
    const petUpdateBody = req.body;
    const petId = req.params.pid;
    if(petUpdateBody.birthDate){
        const birth=new Date(petUpdateBody.birthDate);
        if(isNaN(birth.getTime()))
            return res.status(400).send({status:"error",error:"Invalid birthDate"});
    }
    const result = await petsService.update(petId,petUpdateBody);
    res.send({status:"success",message:"pet updated"})
}

const deletePet = async(req,res)=> {
    const petId = req.params.pid;
    await petsService.delete(petId);
    res.send({status:"success",message:"Pet deleted"});
}

const createPetWithImage = async(req,res) =>{
    const file = req.file;
    const {name,specie,birthDate} = req.body;
    if(!name||!specie||!birthDate||!file) 
        return res.status(400).send({status:"error",error:"Incomplete values"});
    console.log(file);
    const birth=new Date(birthDate);
    if(isNaN(birth.getTime()))
        return res.status(400).send({status:"error", error:"Invalid birthDate"});
    const pet = PetDTO.getPetInputFrom({
        name,
        specie,
        birthDate: birth,
        image:`${__dirname}/../public/img/${file.filename}`
    });
    console.log(pet);
    const result = await petsService.create(pet);
    res.send({status:"success",payload:result})
}
export default {
    getAllPets,
    createPet,
    updatePet,
    deletePet,
    createPetWithImage
}