//const mongoose = require("mongoose")
const {MongoClient} = require("mongodb")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
    },
    password: String,
    email: {
        type: String,
        unique: true,
    }, 
    age: Number,
    last_logged_in: Date,
    friend_list: {
        type: mongoose.SchemaTypes.ObjectId, 
        ref: "Users",
    },
    cards_unlocked: {
        type: mongoose.SchemaTypes.ObjectId, 
        ref: "Card_Count",
    },
    cards_received: Date,
    cards_sent: Date,
    wins: Number,
    losses: Number,
    acorns: Number,
    trade: {
        type: mongoose.SchemaTypes.ObjectId, 
        ref: "Trade_List"},
})

module.exports = mongoose.model("Users", userSchema)