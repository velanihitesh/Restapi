import Customerrhandler from "../services/Customerrhandler.js";
import JWTservices from "../services/JWTservices.js";

const userauth = async (req, res, next) => {
  const authheaders = req.headers.authorization;
  
  if (!authheaders) {
    return next(Customerrhandler.unauthrize());
  }
  const token = authheaders.split(" ")[1];

  try {
    const { _id, role } = JWTservices.verify(token);
    const user = {
      _id,
      role,
    };
   
    req.user = user;
    next();
  } catch (err) {
    return next(err);
  }
};
export default userauth;
