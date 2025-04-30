import { NextResponse } from 'next/server';

export async function POST(){
    try {
        const response = NextResponse.json({ success: true, msg: 'Logged out successfully' });
        response.cookies.set('token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: -1, // Set to -1 to immediately expire the cookie
            path: '/',
        });
        return response;
    
    } 
    catch(error){
        return NextResponse.json({success:false, msg:"Not Logout"});
    }
}
