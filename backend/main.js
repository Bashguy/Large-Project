//These lines access the env file
const dotenv = require("dotenv")
dotenv.config()

//Gets schemas
const Users = require("./Users")
const Admins = require("./Admins")
const Cards = require("./Cards")
const Card_Count = require("./Card_Count")
const Card_List = require("./Card_List")
const Trade_List = require("./Trade_List")

//Gets mongoose library
const mongoose = require("mongoose")

console.log("Started to run database")

//Connects to the database
mongoose.connect(process.env.MONGO_URI)

//run()
//Testing the database
async function run() {
    //Follows format: const newAdmin = new Admins({username: "TestAdmin#", password: "TestPassword#", email: "AdminMail#@test.com"})
    const newAdmin = await Admins.create({username: "TestAdmin2", password: "TestPassword2", email: "AdminMail2@test.com"})
    
    //const newAdmin = new Admins({username: "TestAdmin2", password: "TestPassword2", email: "AdminMail2@test.com"})
    //await newAdmin.save()
    console.log(newAdmin)
}



//control+c to stop running backend
//to run again, type "npm run dev"