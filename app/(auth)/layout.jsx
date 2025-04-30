import React from 'react';
import { cookies } from "next/headers";
import { redirect } from 'next/navigation';

const AuthLayout = async ({children}) =>{
  const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
  
    if(token){
      redirect('/');
    }
  return (
    <div className='auth-layout'>{children}</div>
  )
}

export default AuthLayout
