//const mongoose = require("mongoose")
const {MongoClient} = require("mongodb")

const cardcountSchema = new mongoose.Schema({
    breakfast: {
        uCard_ID: {
            type: mongoose.SchemaTypes.ObjectId, 
            ref: "Cards",
        },
        count: Number,
    },
    lunch: {
        uCard_ID: {
            type: mongoose.SchemaTypes.ObjectId, 
            ref: "Cards",
        },
        count: Number,
    },
    dinner: {
        uCard_ID: {
            type: mongoose.SchemaTypes.ObjectId, 
            ref: "Cards",
        },
        count: Number,
    },
})


module.exports = mongoose.model("Card_Count", cardcountSchema)