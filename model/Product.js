import mongoose from "mongoose";
import { APP_URL } from "../config/index.js";

const Schema = mongoose.Schema

const productSchama = new Schema({
    name:{type:String,required:true},
    price:{type:Number,required:true},
    size:{type:String,required:true},
    image:{type:String,required:true,
        get:(image)=>{
            return `${APP_URL}/${image}`;
        }
    }
},{toJSON:{getters:true}})
 export default  mongoose.model('product',productSchama)