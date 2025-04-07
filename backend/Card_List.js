const mongoose = require("mongoose")

const cardlistSchema = new mongoose.Schema({
    breakfast: {
        card_ID: {
            type: mongoose.SchemaTypes.ObjectId, 
            ref: "Cards".type,
        },
    },
    lunch: {
        card_ID: {
            type: mongoose.SchemaTypes.ObjectId, 
            ref: "Cards".type,
        },
    },
    dinner: {
        card_ID: {
            type: mongoose.SchemaTypes.ObjectId, 
            ref: "Cards".type,
        },
    },
})


module.exports = mongoose.model("Card_List", cardlistSchema)