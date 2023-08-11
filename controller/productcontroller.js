import multer from "multer";
import path from "path";
import fs from "fs";
import Customerrhandler from "../services/Customerrhandler.js";
import Product from '../model/Product.js'
import Joi from "joi";

const storage = multer.diskStorage({
  destination: (req, file, callback) => callback(null, "upload/"),
  filename: (req, file, callback) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    callback(null, uniqueName);
  },
});
const handleMultipartfile = multer({
  storage,
  limits: { fileSize: 1000000 * 50 },
}).single("image");


const productcontroller = {
  async store(req, res, next) {
    // multipart form data
    handleMultipartfile(req, res, async (err) => {
      if (err) {
        return next(Customerrhandler.unauthrize());
      }
      console.log(req.file);

      let filepath = req.file.path;

      const productSchema = Joi.object({
        name: Joi.string().required(),
        price: Joi.number().required(),
        size: Joi.string().required(),
      });
      
      const { error } = productSchema.validate(req.body);
      
      if (error) {
        // Validation Fail(Delete the upload image)
        fs.unlink(`${AppRoot}/${filepath}`, () => {
          return next(Customerrhandler.unauthrize());
        });
        return next(error);
      }
      const { name, price, size } = req.body;
      let document;
      try {
        document = await Product.create({name,price,size,image:filepath});
      } catch (err) {
        return next(err);
      }
      res.json({ prodect_details: document });
    });
  },
  async update(req, res, next) {
    // multipart form data
    handleMultipartfile(req, res, async (err) => {
      if (err) {
        return next(Customerrhandler.unauthrize());
      }
      // console.log(req.file);
      let filepath
      if(req.file){
        filepath = req.file.path;
      }

      const productSchema = Joi.object({
        name: Joi.string(),
        price: Joi.number(),
        size: Joi.string()
      });
      
      const { error } = productSchema.validate(req.body);
      
      if (error) {
        // Validation Fail(Delete the upload image)
        if(req.body){
          fs.unlink(`${AppRoot}/${filepath}`, () => {
            return next(new Error('file not upload' + err.message));
          });
        }
        return next(error);
      }
      const { name, price, size } = req.body;
      let document;
      try {
        document = await Product.findOneAndUpdate({_id:req.params.id},{name,price,size,image:filepath});
      } catch (err) {
        return next(err);
      }
      res.json({ prodect_details: document });
    });
  },
  async destroy(req,res,next){
    const document = await Product.findByIdAndRemove({_id:req.params.id})
      if(!document){
        return next(Customerrhandler.unauthrize())
      }

      const imagepath = document._doc.image
      
      fs.unlink(`${AppRoot}/${imagepath}`,(err)=>{
        if(err){
          return next(err)
        }
    })
    
    res.json(document)
    },
     async index(req, res, next) {
        let document;

        try {
            document = await Product.find().select('-updatedAt -__v').sort({ _id: 1 });
        } catch (err) {
            return next(Customerrhandler.serverError());
        }

        res.json(document);
    },
    async show(req,res,next){
        let document;
        try{
            document = await Product.findOne({_id: req.params.id}).select('-updatedAt -__v');
        }catch(err){
            return next(err);
        }
        res.json(document);
    }
  }

export default productcontroller;
