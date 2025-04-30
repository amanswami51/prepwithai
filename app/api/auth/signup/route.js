import {connectMongoDb} from "@/lib/config/db";
import {User} from "@/lib/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";


export async function POST(request){
    try {
        await connectMongoDb();
        const { name, email, password } = await request.json();

        //find the user if already exists
        let user = await User.findOne({email});
        if(user){
            return NextResponse.json({success:false, error:"Email already exists"});
        }

        //secure the password
        const salt = await bcrypt.genSalt(10);
        const securePassword = await bcrypt.hash(password, salt);

        //create new user
        await User.create({
            name,
            email,
            password:securePassword
        })
        return NextResponse.json({success:true})    
    } 
    catch(error){
        return NextResponse.json({success: false, error: "Internal Server Error"}, { status: 500 })  
    }   
}