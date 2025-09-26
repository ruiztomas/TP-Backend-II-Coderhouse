import adoptionModel from "./models/Adoption.js";

export default class Adoption {
    constructor(){}

    get = async() =>{
        return await adoptionModel.find().populate("user").populate("pet");
    }

    getBy = async(params) =>{
        return await adoptionModel.findOne(params).populate("user").populate("pet");
    }

    create = async(adoption) =>{
        return await adoptionModel.create(adoption);
    }

    update = async(id,adoption) =>{
        return await adoptionModel.findByIdAndUpdate(id,{$set:adoption},{new:true});
    }
    
    delete = async(id) =>{
        return await adoptionModel.findByIdAndDelete(id);
    }
}