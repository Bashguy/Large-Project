//These lines access the env file
const dotenv = require("dotenv")
dotenv.config()

//Fetches mongodb 
const {MongoClient} = require("mongodb")

//Gets the collections
//const Users = require("./Users")
//const Admins = require("./Admins")
const Cards = require("./Cards")
//const Card_Count = require("./Card_Count")
//const Card_List = require("./Card_List")
//const Trade_List = require("./Trade_List")


console.log("Starting program")

async function main() {

    //Connects to the database
    const client = new MongoClient(process.env.MONGO_URI)

    try {

        //Connects to the server
        await client.connect()
        
        console.log("Database connection established")

        //Connects to the database
        const database = client.db()

        //Adjusting the database
        await Admins(database)
        //await Cards(database)
        console.log("Code running successfully!")


    } catch(error) {

        console.log("Error! Couldn't connect to the database!", error)

    } finally {

        await client.close()

    }


}

main().catch(console.dir)