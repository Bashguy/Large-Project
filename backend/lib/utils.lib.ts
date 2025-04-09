import jwt from "jsonwebtoken";

export const generateToken = (userID: Object, res: any): void => {
    const token = jwt.sign({ userID }, <jwt.Secret>process.env.JWT_SEC, { expiresIn: "7d" });

    res.cookie("token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration time in milliseconds (7 days)
        httpOnly: true, // Prevent XSS cross-site scripting attacks         
        sameSite: "Strict", // Protects against CSRF cross-site request forgery attacks
        secure: process.env.NODE_ENV !== "development" // Ensures the cookie is sent over HTTPS in production (=== "production")
    });

    // return token;
};