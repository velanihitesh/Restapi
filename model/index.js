import mongoose from "mongoose";

const Schema = mongoose.Schema

const insertschema = new Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    role:{type:String,default:'manager'}
})
 export default   mongoose.model('User',insertschema)