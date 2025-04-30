import {connectMongoDb} from "@/lib/config/db";
import {User} from "@/lib/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export async function POST(request){
    try {
        await connectMongoDb();
        const { email, password } = await request.json();

        //find the user if already exists
        let user = await User.findOne({email});
        if(!user){
            return NextResponse.json({success:false, error:"User not found"}, {status: 404});
        }

       //check the password is correct or not
       const comparePassword = await bcrypt.compare(password, user.password);
       if(!comparePassword){
           return NextResponse.json({success:false, error:"Incorrect password"}, { status: 401 });
       }

        //generate token
        const data = {
            user:{
                id:user.id
            }
        }
        const token = jwt.sign(data, process.env.JWT_SECRET, {expiresIn: "6h",});

        const response = NextResponse.json({success:true});

        // Set cookie
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 6, // 6 hours
            path: "/"
        });    
        return response; 
    } 
    catch(error){
        return NextResponse.json({success: false, error: "Internal Server Error"}, { status: 500 })  
    }   
}