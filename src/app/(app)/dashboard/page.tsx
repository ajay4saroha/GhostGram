"use client";
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import dbConnect from '@/lib/dbConnect';
import { Message, User } from '@/models/User';
import { acceptMsg } from '@/schemas/acceptMsgSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import {  useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import * as z from 'zod'
import {Button} from '@/components/ui/button'
import { Switch } from '@/components/ui/switch';
import MsgCard from '@/components/customized/MsgCard';


export default function page() {
  // const router = useRouter()
  const [messages,setMessages] = useState<Message[]>([]);
  const [isLoading,setIsLoading] = useState<boolean>(false);
  const [isSwitchLoading,setIsSwitchLoading] = useState<boolean>(false);

  // const [username,setUsername] = useState<string>('');
  // const [profileUrl,setProfileUrl] = useState<string>('');
  // const [isAcceptingMessagesStatus,setIsAcceptingMessagesStatus] = useState<boolean>(false);
  const {data:session} = useSession();
  const {toast} = useToast()
  const user : User = session?.user as User

  const handleDeleteMsg = (messageId:string) => {
    setMessages(messages.filter((message)=>message._id!==messageId))
  }


  const form = useForm({
    resolver:zodResolver(acceptMsg),
  })

  const {register,watch,setValue} = form

  const acceptMessagesStatus : boolean = watch('acceptMessages');

  const fetchAcceptingMsgStatus = useCallback(async ()=>{
    setIsSwitchLoading(true);
    try {
      await dbConnect();
      const response = await axios.get<ApiResponse>('/api/accept-messages')
      if(!response.data?.success){
        toast({
          title:"Error",
          description:response.data?.message,
          variant:"destructive"
        })
        // router.replace('/')
      }
      setValue('acceptMessages',response.data.isAcceptingMessages)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title:"Error",
        description:axiosError.response?.data.message,
        variant:"destructive"
      })
    } finally {
      setIsSwitchLoading(false);
    }
  },[setValue,toast])

  const fetchMessages = useCallback(async (refresh:boolean=false)=>{
    setIsLoading(true);
    setIsSwitchLoading(false);
    try {
      await dbConnect();
      const response = await axios.get<ApiResponse>('/api/get-messages')
      if(!response.data?.success){
        toast({
          title:"Error",
          description:response.data?.message,
          variant:"destructive"
        })
        // router.replace('/')
      }
      // console.log(response.data.messages)
      setMessages(response.data.messages as Message[])
      // console.log(messages)
      if(refresh){
        toast({
          title:"New Messages",
          description:"Latest messages loaded"
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title:"Error",
        description:axiosError.response?.data.message,
        variant:"destructive"
      })
    } finally {
      setIsLoading(false);
      setIsSwitchLoading(false);
    }
  },[setIsLoading,setIsSwitchLoading,toast])

  useEffect(()=>{
    if(!session || !user){
      return;
    }
    fetchMessages()
    fetchAcceptingMsgStatus()
  },[session,setValue,fetchAcceptingMsgStatus,fetchMessages,toast,user])

  const handleChangeAcceptMessage = useCallback(async ()=>{
    try {
      console.log(acceptMessagesStatus)
      await dbConnect();
      const response = await axios.post('/api/accept-messages',{isAcceptingMessages: !acceptMessagesStatus})
      if(!response.data?.success){
        toast({
          title:"Error",
          description:response.data?.message,
          variant:"destructive"
        })
        return;
      }
      // console.log(response.data)
      setValue('acceptMessages',response.data.isAcceptingMessages)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title:"Error",
        description:axiosError.response?.data.message,
        variant:"destructive"
      })
    }
  },[acceptMessagesStatus])

  const username = session?.user.username as string
  const profileUrl = `${window.location.protocol}/${window.location.host}/u/${username}`
  
  const cpyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast({
      title:"Copied",
      description:"URL copied successfully"
    })
  }
  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={cpyToClipboard}>Copy</Button>
        </div>
      </div>
      <div className="mb-4">
        <Switch 
          {...register('acceptMessages')}
          checked={acceptMessagesStatus}
          onCheckedChange={handleChangeAcceptMessage}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessagesStatus ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />
       <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message:Message,index) => (
            <MsgCard
              key={message._id as string}
              message={message}
              onDeleteMessage={handleDeleteMsg}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  )
}
