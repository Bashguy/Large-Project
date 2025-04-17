import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.route";
import cardRoutes from "./routes/card.route";
import { app, server } from "./lib/socket.lib";
import { getCollection } from "./lib/mongo.lib";

dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:3000", 
    credentials: true
}));

// Api routes
app.use("/api/auth", authRoutes);
app.use("/api/card", cardRoutes);

async function startServer() {
    try {
        await getCollection("users"); // Test DB connection before starting server
        console.log("MongoDB connection successful");
        
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1);
    }
}

startServer();