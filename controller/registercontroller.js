import joi from "joi";
import User from "../model/index.js";
import bcrypt from "bcrypt";
import Customerrhandler from "../services/Customerrhandler.js";
import JWTservices from "../services/JWTservices.js";
import { REF_KEY } from "../config/index.js";
import Token from "../model/refreshtoken.js";
const registercontroller = {
  async register(req, res, next) {
    const regiserschema = joi.object({
      name: joi.string().min(2).max(20).required(),
      email: joi.string().email().required(),
      password: joi.string().required(),
    });
    //    console.log(req.body)
    const { error } = regiserschema.validate(req.body);
    if (error) {
      return next(error);
    }
    try {
      const exist = await User.exists({ email: req.body.email });
      if (exist) {
        return next(Customerrhandler.userexists("email already exist....."));
      }
    } catch (err) {
      return next();
    }

    const hash_password = await bcrypt.hash(req.body.password, 10);
    const { name, email, password } = req.body;
    let access_token;
    let ref_token;
    try {
      const result = await User.create({
        name,
        email,
        password: hash_password,
      });
      access_token = JWTservices.sign({ _id: result._id, role: result.role });
      ref_token = JWTservices.sign(
        { _id: result._id, role: result.role },
        "1y",
        REF_KEY
      );
      await Token.create({ token: ref_token });
    } catch (err) {
      return next(err);
    }

    res.json({ access_token: access_token, ref_token: ref_token });
  },
};
export default registercontroller;
