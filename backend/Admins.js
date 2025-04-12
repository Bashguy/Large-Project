const {MongoClient} = require("mongodb")

async function adminSchema(db) { 

    try {

        const adminsCollection = await db.listCollections({name: "admins"}).toArray()

        //Creates the cards collection if it doesn't exist
        if(adminsCollection.length === 0) {

            await db.createCollection("admins", {
                validator: {
                    $jsonSchema: {
                        bsonType: "object",
                        required: ["username", "password", "email"],
                        properties: {
                            username: {bsonType: "string", description: "Admin username must be a string"},
                            password: {bsonType: "string", description: "Admin password description must be a string"},
                            email: {bsonType: "string", description: "Admin email type must be a string"},
                        }
                    }
                }
            })

        //Code that runs on the existing cards database
        } else {

            await db.command({
                collMod: "admins",
                validator: {
                    $jsonSchema: {
                        bsonType: "object",
                        required: ["username", "password", "email"],
                        properties: {
                            username: {bsonType: "string", description: "Admin username must be a string"},
                            password: {bsonType: "string", description: "Admin password description must be a string"},
                            email: {bsonType: "string", description: "Admin email type must be a string"},
                        }
                    }
                }
            })

        }

    } catch (error) {
        console.error("Admins code is not working because: ", error)
    }

}


module.exports = adminSchema