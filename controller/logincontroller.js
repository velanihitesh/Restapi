import joi from "joi";
import User from "../model/index.js";
import Customerrhandler from "../services/Customerrhandler.js";
import bcrypt from "bcrypt";
import JWTservices from "../services/JWTservices.js";
import { REF_KEY } from "../config/index.js";
import Token from "../model/refreshtoken.js";
const logincontroller = {
  async login(req, res, next) {
    const loginschema = joi.object({
      email: joi.string().email().required(),
      password: joi.string().required(),
    });
    //    console.log(req.body)
    const { error } = loginschema.validate(req.body);
    if (error) {
      return next(error);
    }
    let access_token;
    let ref_token;
    try {
      const result = await User.findOne({ email: req.body.email });
      if (!result) {
        return next(Customerrhandler.usernotmatch());
      }
      const match = await bcrypt.compare(req.body.password, result.password);
      if (!match) {
        return next(Customerrhandler.usernotmatch());
      }
      access_token = JWTservices.sign({ _id: result._id, role: result._id });
      ref_token = JWTservices.sign(
        { _id: result._id, role: result._id },
        "1y",
        REF_KEY
      );
      await Token.create({ token: ref_token });
    } catch (err) {
      return next(err);
    }
    res.json({ access_token: access_token, ref_token: ref_token });
  },
  async logout(req, res, next) {
    const refreshSchema = joi.object({
      ref_token: joi.string().required(),
    });
    const { error } = refreshSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    try {
      await Token.deleteOne({ token: req.body.ref_token });
    } catch (error) {
      return next(err);
    }
    res.json({ status: 1 });
  },
};
export default logincontroller;
