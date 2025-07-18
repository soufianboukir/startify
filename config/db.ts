import mongoose from "mongoose"


const dbUrl: string = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/startify"

export const dbConnection = async () =>{
    try{
        await mongoose.connect(dbUrl)
    }catch{
        console.log('failed to connect to db');
    }
}