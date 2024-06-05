import mongoose from "mongoose";
import * as dotenv from 'dotenv'

dotenv.config();

let isConnected = false;

const connectToDB = async () => {
    mongoose.set("strictQuery", true);

    if (isConnected){
        console.log("MongoDB is already connected");
        return ;
    }
    try {
        if (!process.env.MONGO_DB_URI) {
            throw new Error ("Mongo DB secret key is missing");
        }
        await mongoose.connect(process.env.MONGO_DB_URI, {
            //change db name to the one you want to use in your mongodb portal
            dbName: "chat-app",
        });
        isConnected = true;
        console.log("MongoDB connected succesfully");
    } catch (error) {
        console.log(error);
    }
}

export default connectToDB;