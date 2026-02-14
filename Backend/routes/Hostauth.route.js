import express from "express";
import { signup,login,getMe } from "../controllers/Hostauth.controller.js";
import { hostauthmiddleware } from "../middleware/host.auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/",hostauthmiddleware,getMe);


export default router;