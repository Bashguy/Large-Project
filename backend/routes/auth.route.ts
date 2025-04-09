import express from "express";
import { 
    SignUp, 
    LogIn, 
    LogOut, 
    CheckAuth, 
    DeleteAccount,
    AddFriend,
    RemoveFriend,
    GetFriendList,
    UpdateGameStats
} from "../controller/auth.controller";
import { securityRoute } from "../middleware/auth.middleware";

const router = express.Router();

// Public routes
router.post("/signup", SignUp);
router.post("/login", LogIn);
router.post("/logout", LogOut);

// Protected routes
router.get("/check", securityRoute, CheckAuth);
router.delete("/delete", securityRoute, DeleteAccount);

// Friend management
router.post("/friend", securityRoute, AddFriend);
router.delete("/friend/:friendId", securityRoute, RemoveFriend);
router.get("/friends", securityRoute, GetFriendList);

// Game stats
router.put("/game-stats", securityRoute, UpdateGameStats);

export default router;