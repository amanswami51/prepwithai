"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const Logout = () =>{
    const router = useRouter();

    async function handleLogout(){
        const res = await fetch('/api/auth/logout', {
            method: 'POST', 
        });
        const x = await res.json();
        if(!x.success){
            toast.error(x.msg);
            return;
        }
        toast.success(x.msg);
        router.push('/sign-in');
    }
  return (
    <>
       <Button className="mt-2 btn cursor-pointer" onClick={handleLogout}>Logout</Button>
    </>
  )
}

export default Logout
