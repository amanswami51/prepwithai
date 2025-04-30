import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { cookies } from "next/headers";
import Logout from '@/components/Logout';
import { redirect } from 'next/navigation';


const RootLayout= async ({children})=>{
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if(!token){
    redirect('/sign-in');
  }

  return(
    <div className='root-layout'>
      <nav className='flex justify-between'>
        <Link href="/" className='flex items-center gap-2'>
          <Image src="/logo.svg" alt="logo" width={38} height={32} />
          <h2 className="text-primary-100">PrepWithAI</h2>
        </Link>
        <Logout />
      </nav>
      {children}
    </div>
  )
}

export default RootLayout
