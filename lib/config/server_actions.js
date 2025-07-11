"use server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectMongoDb } from "@/lib/config/db";
import { User } from "@/lib/models/User";
import { Interview } from "../models/Interview";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { feedbackSchema } from "@/constants";
import { Feedback } from "../models/Feedback";


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

export const getInterviewById = async(id)=>{
  try{
    await connectMongoDb();
    const interview = await Interview.findById(id);
    if(!interview){
      return null;
    }
    return interview;
  }
  catch(error){
    console.error("Error fetching interviews:", error);
    return null;  
  }
}

export async function createFeedback(params){
  const {interviewId, userId, transcript} = params;

  try {
    const formattedTranscript = transcript.map((sentence)=>(
      `- ${sentence.role}: ${sentence.content}\n`
    )).join('');

    const {object} = await generateObject({
      model: google("gemini-2.0-flash-001", {
        structuredOutputs: false,
      }),
      schema: feedbackSchema,
      prompt: `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem-Solving**: Ability to analyze problems and propose solutions.
        - **Cultural & Role Fit**: Alignment with company values and job role.
        - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
        `,
      system:"You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
          
    })

    const feedback = {
        interviewId: interviewId,
        userId: userId,
        totalScore: object.totalScore,
        categoryScores: object.categoryScores,
        strengths: object.strengths,
        areasForImprovement: object.areasForImprovement,
        finalAssessment: object.finalAssessment,
        createdAt: new Date().toISOString(),
    };
    
    var x = new Feedback(feedback);
    var feedbackRef = await x.save();

    return { success: true, id: feedbackRef._id };
  } 
  catch (e) {
    console.error('Error saving feedback', e);
    return { success: false};
  }
}

export const getFeedbackByInterviewId = async(params)=>{
  const {userId, interviewId} = params;
  try{
    await connectMongoDb();
    const feedback = await Feedback.findOne({interviewId:interviewId, userId:userId});
    return feedback || null;
  }
  catch(error){
    console.error("Error fetching interviews:", error);
    return null;  
  }
}