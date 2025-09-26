import mongoose from "mongoose";

const collection = "Adoptions";

const schema = new mongoose.Schema({
    owner:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Users',
        required:true
    },
    pet:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Pets',
        required: true
    },
    date:{
        type:Date,
        default:Date.now
    }
});

schema.pre('find', function(){
    this.populate('owner').populate('pet');
});
schema.pre('findOne', function(){
    this.populate('owner').populate('pet');
});

const adoptionModel = mongoose.model(collection,schema);

export default adoptionModel;