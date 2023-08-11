import User from "../model/index.js";
import Customerrhandler from "../services/Customerrhandler.js";
const usercontroller = {
  async me(req, res, next) {
    try {
      const result = await User.findOne({ _id: req.user._id });
      if (!result) {
        return next(Customerrhandler.unauthrize());
      }
      res.json(result);
    } catch (error) {
      return next(new Error("somthi wrong" + error.message));
    }
  },
};
export default usercontroller;
