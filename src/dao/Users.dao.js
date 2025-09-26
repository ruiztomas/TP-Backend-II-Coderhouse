import userModel from "./models/User.js";


export default class Users {
    constructor(){}
    
    get = async() =>{
        return await userModel.find();
    }

    getBy = async(params) =>{
        return await userModel.findOne(params);
    }

    create = async(user) =>{
        return await userModel.create(user);
    }

    update = async(id,user) =>{
        return await userModel.findByIdAndUpdate(id,{$set:user}, {new:true});
    }

    delete = async(id) =>{
        return await userModel.findByIdAndDelete(id);
    }
}