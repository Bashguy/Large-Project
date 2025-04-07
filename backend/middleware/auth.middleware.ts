import jwt from "jsonwebtoken";
import User from "../models/user.model";

export const securityRoute = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ success: false, msg: "Unauthorized - No Token Provided" });
        }
        
        const verifyToken = jwt.verify(token, process.env.JWT_SEC);
        if (!verifyToken) {
            return res.status(401).json({ success: false, msg: "Unauthorized - Invalid Token" });
        }
        
        const user = await User.findById(verifyToken.userID).select("-password");
        if (!user) {
            return res.status(401).json({ success: false, msg: "User not found" });
        }

        req.info = user;
        next();

    } catch (error) {
        return res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
};