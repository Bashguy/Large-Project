import express from 'express'
const app = express()
import dotenv from 'dotenv'
import { connectDB } from './db/pantry.js'
import cors from 'cors'
import authRoutes from './auth.js'

dotenv.config()

const PORT = process.env.PORT

app.use(cors())
app.use(express.json())

app.get("/api", (req, res) => {
    res.json({"users": ["userOne", "userTwo", "monkey"]})
})

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log("Listening to Server " + PORT)
});