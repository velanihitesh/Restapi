import express from "express";
import {logincontroller,productcontroller,refreshcontroller,registercontroller,usercontroller,} from "../controller/index.js";
import userauth from "../middleware/userauth.js";
 import admin from "../middleware/admin.js";

const router = express.Router();

router.post("/", registercontroller.register);
router.post("/login", logincontroller.login);
router.post("/logout", logincontroller.logout);
router.post("/auth", userauth, usercontroller.me);
router.post("/ref", refreshcontroller.refresh);
 router.post("/product",[userauth, admin], productcontroller.store);
router.put("/update/:id", [userauth, admin], productcontroller.update);
router.delete("/destroy/:id", [userauth, admin], productcontroller.destroy);
 router.get("/show/:id", productcontroller.show);
router.get("/index", productcontroller.index);

export default router;
