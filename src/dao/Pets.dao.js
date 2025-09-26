import petModel from "./models/Pet.js";

export default class Pet {
    constructor(){}

    get = async() =>{
        return await petModel.find()
    }

    getBy = async(params) =>{
        return await petModel.findOne(params);
    }

    create = async(pet) =>{
        return await petModel.create(pet);
    }

    update = async(id,pet) =>{
        return await petModel.findByIdAndUpdate(id,{$set:pet},{new:true});
    }

    delete = async(id) =>{
        return await petModel.findByIdAndDelete(id);
    }
}