import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { collections } from "../lib/mongo.lib";

// Define the JWT payload type
interface JwtUserPayload extends jwt.JwtPayload {
  userID: string | ObjectId;
}

export const securityRoute = async (req: any, res: any, next: any): Promise<void> => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ success: false, msg: "Unauthorized - No Token Provided" });
        }
        
        const verifyToken = jwt.verify(token, process.env.JWT_SEC as jwt.Secret) as JwtUserPayload;
        
        // Convert to ObjectId
        let userId = (verifyToken.userID instanceof ObjectId) ? verifyToken.userID : new ObjectId(verifyToken.userID);
        
        // Get users collection and find user
        const userCollection = await collections.users();
        const user = await userCollection.findOne(
            { _id: userId },
            { projection: { password: 0 } } // Exclude password
        );
        
        if (!user) {
            return res.status(401).json({ success: false, msg: "User not found" });
        }
        
        req.info = user;
        next();

    } catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
};