"use client";
import { zodResolver } from '@hookform/resolvers/zod'
import React ,{useState} from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { msgSchema } from '@/schemas/msgSchema'
import { useParams, useRouter } from 'next/navigation'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Textarea } from "@/components/ui/textarea"
import { Button } from '@/components/ui/button'
import axios, { AxiosError } from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { ApiResponse } from '@/types/ApiResponse';


export default function page() {
  const router = useRouter()
  const params = useParams<{username:string}>();
  const [message,setMessage] = useState<string>("");
  const {toast} = useToast()
  const form = useForm<z.infer<typeof msgSchema>>({
    resolver:zodResolver(msgSchema),
    defaultValues:{
      content:""
    }
  })

  //////////////////////// req to send msg ////////////////////

  const sendMessage = async(message:string) => {
    try {
      const response = await axios.post<ApiResponse>('/api/send-message',{
        username:params.username,
        msg:message
      })

      if(!response.data.success){
        toast({
          title:"Error",
          description:response.data?.success ?? "Error in sending message",
          variant:'destructive'
        })
        return;
      }
      toast({
        title:"Success",
        description:response.data?.success ?? "Message Sent",
      })
      router.refresh();
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      console.log("Axios Error : ",axiosError)
      toast({
        title:"Error",
        description:axiosError?.response?.data?.message ?? "Internal Server Error",
        variant:"destructive"
      })
    }
  }


  const onSubmit = async (data:z.infer<typeof msgSchema>) => {
    try {
      // console.log(data.content)
      setMessage(data.content)
      sendMessage(data.content);

    } catch (error) {
      console.log("Error occured in sending message : ",error)
    }
  }
  return (
    <div className='flex justify-evenly items-center h-screen bg-gradient-to-b from-gray-900 to-gray-700 text-white relative'>
  <div className='w-1/2 text-4xl font-bold text-gray-200 opacity-20 ms-10'>
    <p className='whitespace-pre-wrap'>You are now a Ghost! Send suggestion.</p>
  </div>
  <div className="w-1/2">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-3">
          <FormField
            name='content'
            control={form.control}
            render={({field})=>(
              <FormItem>
                <FormLabel>
                  Enter message
                </FormLabel>
                <FormControl>
                  <Textarea placeholder='Enter your message' {...field} className='w-3/4'/>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="mb-3">
          <Button type='submit' >
            Send message
          </Button>
        </div>
      </form>
    </Form>
  </div>
</div>
  )
}
