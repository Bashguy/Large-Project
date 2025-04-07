import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.route";
import cardRoutes from "./routes/card.route";
import { app, server } from "./lib/socket.lib";

import path from "path";

dotenv.config();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/card", cardRoutes);

server.listen(PORT, () => {
    console.log("Connected to http://localhost:" + PORT);
    connectDB();
});