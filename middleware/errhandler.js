import joi from "joi";
import { DEBUG_MODE } from "../config/index.js";
import Customerrhandler from "../services/Customerrhandler.js";
const { ValidationError } = joi;

const errhandler = (err, req, res, next) => {
  let statuscode = 500;
  let errdata = {
    mess: "internal server error",
    originalError: err.message,
    ...(DEBUG_MODE === "true" && { originalError: err.massage }),
  };

  if (err instanceof ValidationError) {
    statuscode = 422;
    errdata = {
      mess: err.message,
    };
  }
  if (err instanceof Customerrhandler) {
    statuscode = err.status;
    errdata = {
      mess: err.message,
    };
  }
  return res.status(statuscode).json(errdata);
};
export default errhandler;
