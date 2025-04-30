import mongoose from "mongoose";

export const connectMongoDb = async()=>{
   try{
      const MONGODB_URI = process.env.MongoDB_URI;
      await mongoose.connect(MONGODB_URI);
      console.log("MongoDB connected");
   }
   catch(error){
      console.log("Data base is not connected", error);
   } 

}