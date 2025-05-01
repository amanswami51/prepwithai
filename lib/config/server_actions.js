import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectMongoDb } from "@/lib/config/db";
import { User } from "@/lib/models/User";
import { Interview } from "../models/Interview";


const getUserIdFromToken = async()=>{

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  const JWT_SECRET = process.env.JWT_SECRET;
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }

  return decoded.user.id;
}

export const getServerUser = async () => {

  const userId =  await getUserIdFromToken();
  if (!userId) return null;

  await connectMongoDb();
  const user = await User.findById(userId);
  if (!user) return null;

  return user;
};

export const getInterviewsByUserID = async(userId)=>{
  try{
    await connectMongoDb();
    const interviews = await Interview.find({userId:userId}).sort({ createdAt: -1 }).lean();
    return interviews;
  }
  catch(error){
    console.error("Error fetching interviews:", error);
    return null;  
  }
}

export const getLetestInterviews = async(params)=>{
  const {userId, limit=20} = params;
  try{
    await connectMongoDb();
    const interviews = await Interview.find({userId:{ $ne: userId }}).sort({ createdAt: -1 }).limit(limit).lean();
    return interviews;
  }
  catch(error){
    console.error("Error fetching interviews:", error);
    return null;  
  }
}