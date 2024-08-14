"use client";
import { useToast } from '@/components/ui/use-toast';
import { verifyCodeSchema } from '@/schemas/verifyCodeSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React,{useState} from 'react'
import { useForm } from 'react-hook-form';
import axios from 'axios'
import * as z from 'zod'
import { ApiResponse } from '@/types/ApiResponse';
import { Button } from "@/components/ui/button"
import {Loader2} from 'lucide-react'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"




export default function page() {
  const [isVerifying,setIsVerifying] = useState<boolean>(false);
  // const [verificationMsg,setVerificationMsg] = useState<string>("");
  const router = useRouter()
  const params = useParams<{username:string}>()
  const {toast} = useToast()
  const form = useForm<z.infer<typeof verifyCodeSchema>>({
    resolver:zodResolver(verifyCodeSchema)
  })

  const onSubmit = async (data:z.infer<typeof verifyCodeSchema>) => {
    try {
      setIsVerifying(true);
      const response = await axios.post('/api/verify-code',{username:params.username,code:data.code})
      if(!response.data?.success){
       throw new Error(response.data.message ?? "Error in verify code 1")
      }
      toast({
        title:"Verified Successful",
        description:"Welcome to GhostGram! \n Please Login to adventure" 
      })
      router.replace('/sign-in')
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.log("Error in verify code 2: ",axiosError.response?.data.message)
      toast({
        title:"Verfication Failed",
        description: axiosError.response?.data.message,
        variant:'destructive'
      })
    } finally {
      setIsVerifying(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Verify Your Account
            </h1>
            <p className="mb-4">Enter the verification code sent to your email</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <Input  placeholder="code" {...field}  maxLength={6} minLength={6}/>
                    </FormControl>
                    <FormDescription>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">
                {
                  isVerifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </>
                  ):"Verify"
                }
              </Button>
            </form>
          </Form>
        </div>
    </div>
  )
}
