"use server";
import mongoose from "mongoose";

type ConnectObj ={
    isConnected?:number
}

const connection : ConnectObj = {}

export default async function dbConnect():Promise<void>{
    if(connection.isConnected){
        console.log("Already Connected");
        return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '')
        connection.isConnected = db.connections[0].readyState;
        console.log("DB CONNECTED SUCCESS");
    } catch (error) {
        console.log("DB CONNECTED FAILED\n",error)
        process.exit(1);
    }
}