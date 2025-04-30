"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"


 
const authFormSchema = (type)=>{
  return z.object({
    name: type==='sign-up'?z.string().min(3, "Name must be at least 3 characters"):z.string().optional(),
    email: z.string().email("Invalid email"),
    password:z.string().min(5, "Password must be at least 5 characters"),
  })
}

const AuthForm = ({type}) =>{
  const router = useRouter();
  // const formSchema = authFormSchema(type);

  const formVar = useForm({
    resolver: zodResolver(authFormSchema(type)),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })
 
  async function onSubmit(values) {
    try {
      if(type==='sign-up'){//sign-up api call

        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            password: values.password,
          }),
        });
    
        const data = await res.json();
        if(!data.success){
          toast.error(data.error);
          return;
        }
        toast.success('Account created successfully. Please sign in.');
        router.push('/sign-in');

      }else{//Login api call
        const res = await fetch('/api/auth/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
          }),
        });
    
        const data = await res.json();
        if(!data.success){
          toast.error(data.error);
          return;
        }
        toast.success('Sign in successfully.');
        router.push('/');
      }
    } 
    catch (error) {
      toast.error(`There was an error: ${error.message}`);
    }
  }
  function onError(errors) {
    if(errors.name) {
      toast.error(errors.name.message);
    }else if(errors.email) {
      toast.error(errors.email.message);
    }else if(errors.password) {
      toast.error(errors.password.message);
    }
  }
  

  const isSignIn = type==='sign-in';
  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" height={32} width={38}/>
          <h2 className="text-primary-100">PrepWithAI</h2>
        </div>
        <h3>Practice Job Interview with AI</h3>
          <form onSubmit={formVar.handleSubmit(onSubmit, onError)} className="flex flex-col">
            {!isSignIn && (
              <input 
                {...formVar.register("name")}
                className="p-2 my-2 border-2 rounded-lg outline-none" 
                type="text" 
                name='name' 
                placeholder='Enter name' 
              />
            )}
              <input
                {...formVar.register("email")}
                className="p-2 my-2 border-2 rounded-lg outline-none" 
                type="email" 
                name='email' 
                placeholder='Enter email'
              />
              <input 
                {...formVar.register("password")}
                className="p-2 my-2 border-2 rounded-lg outline-none" 
                type="password" 
                name='password' 
                placeholder='Enter password' 
              />
              <Button 
                className="mt-2 btn" 
                type="submit"
              >
                {isSignIn?'Sign in':'Create an Account'}
              </Button>
          </form>
        <p className="text-center">
          {isSignIn?'No account yet?':'Have an account already?'}
          <Link href={!isSignIn?'/sign-in':'/sign-up'} className="font-bold text-user-primary ml-1">
            {!isSignIn?"Sign in":"Sign up"}
          </Link>
        </p>
       
      </div>
    </div>
  )
}

export default AuthForm
