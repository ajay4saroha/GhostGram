"use client";
import { Form, FormField, FormItem, FormLabel, FormMessage,FormControl, FormDescription } from '@/components/ui/form'
import { useToast } from '@/components/ui/use-toast'
import { signInSchema } from '@/schemas/signInSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import axios, { AxiosError } from 'axios'
import  Link  from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Loader2 } from 'lucide-react';


export default function page() {
  const {toast} = useToast()
  const router = useRouter()
  // const [isSigning,setIsSigning] = useState<boolean>(false);
  const [isSigning,setIsSigning] = useState<boolean>(false);
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver:zodResolver(signInSchema),
    defaultValues:{
      identifier:'',
      password:''
    }
  })

  const onSubmit = async (data:z.infer<typeof signInSchema>) => {
    try {
      setIsSigning(true);
      const res = await signIn('credentials',{
        redirect:false,
        identifier:data.identifier,
        password:data.password
      })

      if(res?.error){
        console.log(res?.error)
        if(res.error==='CredentialsSignin'){
          toast({
            title:"Incorrect Credetials",
            description:"Enter valid username and password",
            variant:'destructive'
          })
        }
        else {
          toast({
            title:"Error",
            description:"Error in sign in",
            variant:'destructive'
          })
        }
      }
      if(res?.url){
        router.replace('/dashboard')
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      console.log("Error occured in Sign in : ",axiosError.response?.data.message)
      toast({
        title:"Error in sigining in",
        description:axiosError.response?.data.message,
        variant:'destructive'
      })
    } finally {
      setIsSigning(false);
    }
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-700">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className=" flex text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome Back to GhostGram
          </h1>
          <p className="mb-4">Sign in to continue your secret conversations</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="identifier"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Username/Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email or username" {...field} />
                  </FormControl>
                  <FormDescription>
                    {/*  */}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter password" {...field} />
                  </FormControl>
                  <FormDescription>
                    {}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='w-full' type="submit" disabled={isSigning}>
            {
              isSigning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ):"Login"
            }
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Not a member yet?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
            Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
