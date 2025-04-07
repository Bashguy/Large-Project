const mongoose = require("mongoose")

const cardSchema = new mongoose.Schema({
    name: String,
    stars: Number,
    description: String,
    type: String,
    grid_id: String,
})

module.exports = mongoose.model("Cards", cardSchema)