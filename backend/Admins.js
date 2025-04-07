const mongoose = require("mongoose")

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
    },
    password: String,
    email: {
        type: String,
        unique: true,
    }, 
})

module.exports = mongoose.model("Admins", adminSchema)