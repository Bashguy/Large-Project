import { generateToken } from "../lib/utils.lib";
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.lib";
import multer from "multer";

const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 },  // 10MB limit
}).single("img"); // Use "img" to match the formData key on the frontend

export const SignUp = async (req, res: any): Promise<void> => {
    // const { fullName, email, password } = req.body; -> { fullName: req.body.fullName, email: req.body.email, password: req.body.password }
    const newUser: { fullName: string, email: string, password: string } = req.body;

    try {
        if (!newUser.fullName || !newUser.email || !newUser.password) {
            return res.status(400).json({ success: false, msg: "All fields are required" });
        }

        if (newUser.password.length < 6) {
            return res.status(400).json({ success: false, msg: "Password must be at least 6 characters" });
        }
        
        const userExists: any = await User.findOne({ email: newUser.email }); // findOne({ email })
        if (userExists) return res.status(400).json({ success: false, msg: "Email already exists" });

        const salt: string = await bcrypt.genSalt(10);
        const hashPassword: string = await bcrypt.hash(newUser.password, salt);

        newUser.password = hashPassword;
        const createdUser: any = new User(newUser);

        if (createdUser) {
            generateToken(createdUser._id, res);
            await createdUser.save();

            return res.status(201).json({ success: true, msg: "Account created successfully" });

        } else {
            return res.status(400).json({ success: false, msg: "Invalid user data" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
};

export const LogIn = async (req: any, res: any): Promise<void> => {
    const currUser: { email: string, password: string } = req.body;
    try {
        if (!currUser.email || !currUser.password) {
            return res.status(400).json({ success: false, msg: "All fields are required" });
        }
    
        const userExists: any = await User.findOne({ email: currUser.email });
    
        if (userExists) {
            const isPassValid: boolean = await bcrypt.compare(currUser.password, userExists.password);

            if (isPassValid) {
                generateToken(userExists._id, res);

                const { _id, fullName, email, profilePic } = userExists;
                return res.status(200).json({ success: true, data: { _id, fullName, email, profilePic } });
            } else {
                return res.status(400).json({ success: false, msg: "Invalid credentials" });
            }
        } else {
            return res.status(400).json({ success: false, msg: "Invalid credentials" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
};

export const LogOut = async (req: any, res: any): Promise<void> => {
    try {
        res.cookie("token", "", { maxAge: 0 });
        return res.status(200).json({ success: true, msg: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
};

export const UpdateProfile = async (req: any, res: any): Promise<void> => {
    // Use multer's middleware to handle the file upload
    upload(req, res, async (err: any) => {
        if (err) {
            // Handle Multer errors like file size too large
            return res.status(400).json({ success: false, msg: 'File upload failed: ' + err.message });
        }

        const { file: profilePic } = req; // req.file
        const userID = req.info._id;

        if (!profilePic) {
            return res.status(400).json({ success: false, msg: "Profile pic is required" });
        }

        try {
            // Upload the file to Cloudinary (Cloudinary's uploader expects a readable stream)
            const uploadRes = await cloudinary.uploader.upload_stream(
              { resource_type: 'auto' }, // Automatically determine file type (image, video, etc.)
              async (error, result: any) => {
                if (error) {
                  return res.status(500).json({ success: false, msg: "Cloudinary upload failed" });
                }
      
                // Once Cloudinary uploads the file, update the user's profile with the URL
                const updateUser = await User.findByIdAndUpdate(
                  userID,
                  { profilePic: result.secure_url },
                  { new: true }
                ).select("-password");
      
                return res.status(200).json({ success: true, data: updateUser });
              }
            );
      
            // Pipe the file buffer to Cloudinary upload stream
            uploadRes.end(profilePic.buffer);
      
          } catch (error) {
            return res.status(500).json({ success: false, msg: "Internal Server Error" });
          }
    });
};

export const CheckAuth = (req: any, res: any): void => {
    try {
        return res.status(200).json({ success: true, data: req.info });
    } catch (error) {
        return res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
};  