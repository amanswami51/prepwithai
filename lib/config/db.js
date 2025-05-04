import mongoose from "mongoose";

let isConnected = false; 

export const connectMongoDb = async()=>{

   if(isConnected){// Already connected
      return;
   }

   try{
      const MONGODB_URI = process.env.MongoDB_URI;

      const db = await mongoose.connect(MONGODB_URI);

      isConnected = db.connections[0].readyState === 1;
      if(isConnected){
         console.log("MongoDB connected");
      } 
      else{
         console.log("MongoDB connection failed");
      }
   }
   catch(error){
      console.log("Data base is not connected", error);
   } 

}