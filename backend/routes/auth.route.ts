import express from "express";
import { CheckAuth, LogIn, LogOut, SignUp, UpdateProfile } from "../controllers/auth.controller";
import { securityRoute } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/signup", SignUp);

router.post("/login", LogIn);

router.post("/logout", LogOut);

router.put("/update-pfp", securityRoute, UpdateProfile);

router.get("/check", securityRoute, CheckAuth)

export default router;