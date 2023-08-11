import joi from "joi";
import Token from "../model/refreshtoken.js";
import User from "../model/index.js";
import Customerrhandler from "../services/Customerrhandler.js";
import JWTservices from "../services/JWTservices.js";
import { REF_KEY } from "../config/index.js";
const refreshcontroller = {
  async refresh(req, res, next) {
    const refreshSchema = joi.object({
      ref_token: joi.string().required(),
    });
    const { error } = refreshSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    let Refresh;
    try {
      Refresh = await Token.findOne({ token: req.body.ref_token });
      if (error) {
        return next(Customerrhandler.unauthrize("not found"));
      }
      let userid;
      try {
        const { _id } = JWTservices.verify(Refresh.token, REF_KEY);
        userid = _id;
      } catch (err) {
        return next();
      }
      const result = await User.findOne({ _id: userid });

      const access_token = JWTservices.sign({
        _id: result._id,
        role: result.role,
      });
      const ref_token = JWTservices.sign(
        { _id: result._id, role: result.role },
        "1y",
        REF_KEY
      );
      await Token.create({ token: ref_token });
      res.json({ access_token: access_token, ref_token: ref_token });
    } catch (error) {
      return next(new Error("somthi wrong" + error.message));
    }
  },
};
export default refreshcontroller;
