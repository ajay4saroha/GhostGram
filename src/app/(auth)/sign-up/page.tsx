"use client";
import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Spinner } from '@/components/ui/Spinner';
import {useDebounceValue} from 'usehooks-ts'
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/signUpSchema';
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function page() {
  const [username,setUsername] = useState<string>('');
  const [usernameMsg,setUsernameMsg] = useState<string>('');
  const [isCheckingUsername,setIsCheckingUsername] = useState<boolean>(false);
  const [fromSubmit,setFormSubmit] = useState<boolean>(false)
  const [debouncedUsername] = useDebounceValue(username,1000);
  const {toast} = useToast();
  const route = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver:zodResolver(signUpSchema),
    defaultValues:{
      username:"",
      email:"",
      password:"",
    }
  })

  useEffect(()=>{
    const usernameUnique = async () => {
      // console.log(debouncedUsername)
      if(!debouncedUsername){
        return;
      }
      setIsCheckingUsername(true);
      setUsernameMsg('');
      try {
        const reqParam = encodeURIComponent(debouncedUsername)
        const response = await axios.get(`/api/check-username?username=${reqParam}`)
        setUsernameMsg(response?.data?.message);
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        setUsernameMsg(axiosError.response?.data.message ?? "Error in username check")
      } finally {
        setIsCheckingUsername(false);
      }
    }
    // return;
    usernameUnique();
  },[debouncedUsername])

  const onSubmit = async (data:z.infer<typeof signUpSchema>) => {
    setFormSubmit(true);
    // console.log(data)
    // return;
    try {
      const response = await axios.post('/api/signup/',data)
      toast({
        title:"Success",
        description:response.data.message
      })
      route.replace(`/verify/${username}`)
      setFormSubmit(false)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      let e = axiosError.response?.data.message
      console.log("Error in sign up :",e)
      toast({
        title:"OOPS! sign failed",
        description:e ?? "Error in sign up"
      })
      setFormSubmit(false);
    } 
  }
  return (
    <div className='flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-700'>
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join GhostGram
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure.</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter username" {...field} onChange={(e)=>{
                      field.onChange(e)
                      setUsername(e.target.value)
                    }
                    }
                    />
                  </FormControl>
                  <FormDescription>
                    {
                      usernameMsg
                    }
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
          />
           <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email address" {...field} />
                  </FormControl>
                  <FormDescription>
                    {/* Enter your email. */}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
          />
          <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter password" {...field} />
                  </FormControl>
                  <FormDescription>
                    {/*  */}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
          />
          <Button type='submit' disabled={fromSubmit}> 
            {
              fromSubmit ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : "Signup"
            } 
          </Button>
          </form>
          <div className='flex justify-center'>
          Already a member?<Link href={'/sign-in'} className='text-blue-700'>Sign In</Link>
        </div>
        </Form>
      </div>
    </div>
  )
}
