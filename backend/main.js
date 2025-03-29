import express from 'express'
const app = express()
import dotenv from 'dotenv'
import { connectDB } from './db/pantry.js'

dotenv.config()

const PORT = process.env.PORT

app.get("/api", (req, res) => {
    res.json({"users": ["userOne", "userTwo", "monkey"]})
})

app.listen(PORT, () => {
    connectDB();
    console.log("Listening to Server " + PORT)
});