import mongoose from "mongoose";
import dotenv from "dotenv";
import e from "express";
dotenv.config();
// Importing dotenv to load environment variables from a .env file

const connectDB = async (): Promise<void> => {

    const uri = process.env.MONGO_URI as string;
    // Type assertion to ensure MONGO_URI is a string
    try{
        const connectionString = `${uri}`;
        await mongoose.connect(connectionString);
        console.log("%cMongoDB connected", "color: green; font-weight: bold;");
    }catch(err){
        console.error("%cMongoDB connection error:", "color: red; font-weight: bold;", err);
        process.exit(1); //Exit the process with failure
    }
}

export default connectDB;
// Exporting the connectDB function to be used in other files