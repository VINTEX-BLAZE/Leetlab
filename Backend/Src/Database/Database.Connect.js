// Importing required modules
import mongoose from "mongoose";
import dotenv from 'dotenv'

// Configuring the environment variables
dotenv.config({ path: '../.env' })

// Connecting to Database

export const DatabaseConnect = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)  
        console.log("Successfully Connected To Database")
    } catch (error) {
        console.log("Failed to Connect with Database", error)
        process.exit(1)
    }
}