import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { connectDB } from './db/pantry.js'
import authRoutes from './auth.js'
import friendRoutes from './routes/friends.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT

app.use(cors())
app.use(express.json())

const db = await connectDB();
app.locals.db = db;

app.get("/api", (req, res) => {
    res.json({ "users": ["userOne", "userTwo", "monkey"] });
});

app.use("/api/auth", authRoutes);
app.use("/api/friends", friendRoutes);

app.listen(PORT, () => {
    console.log("Listening on port " + PORT);
});
