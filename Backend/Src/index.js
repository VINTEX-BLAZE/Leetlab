// Importing required modules
import App from "./app.js";
import dotenv from 'dotenv'
import { DatabaseConnect } from "./Database/Database.Connect.js";

// configuring environment variable
dotenv.config({ path: "./.env" })


// Seting Up a the Server

const Port = process.env.PORT ?? 8080

DatabaseConnect().then(App.listen(Port, console.log('The Server is Running on Port : ', Port)))
