const {MongoClient} = require("mongodb")

async function cardSchema(db) { 

    try {

        const cardsCollection = await db.listCollections({name: "cards"}).toArray()

        //Creates the cards collection if it doesn't exist
        if(cardsCollection.length === 0) {

            await db.createCollection("cards", {
                validator: {
                    $jsonSchema: {
                        bsonType: "object",
                        required: ["name", "stars", "description", "type", "grid_id"],
                        properties: {
                            name: {bsonType: "string", description: "Card name must be a string"},
                            stars: {bsonType: "int", description: "Card star must be an int"},
                            description: {bsonType: "string", description: "Card description must be a string"},
                            type: {bsonType: "string", description: "Card type must be a string"},
                            grid_id: {bsonType: "string", description: "Card grid_id must be a string"}
                        }
                    }
                }
            })

        //Code that runs on the existing cards database
        } else {

            await db.command({
                collMod: "cards",
                validator: {
                    $jsonSchema: {
                        bsonType: "object",
                        required: ["name", "stars", "description", "type", "grid_id"],
                        properties: {
                            name: {bsonType: "string", description: "Card name must be a string"},
                            stars: {bsonType: "int", description: "Card star must be an int"},
                            description: {bsonType: "string", description: "Card description must be a string"},
                            type: {bsonType: "string", description: "Card type must be a string"},
                            grid_id: {bsonType: "string", description: "Card grid_id must be a string"}
                        }
                    }
                }
            })

        }

    } catch (error) {
        console.error("Cards code is not working because: ", error)
    }

}


module.exports = cardSchema