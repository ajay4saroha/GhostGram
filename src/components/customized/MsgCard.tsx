"use client";
import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { AlertDialogHeader, AlertDialogFooter } from '../ui/alert-dialog';
import { useToast } from '../ui/use-toast';
import axios, { AxiosError } from 'axios';
import { Message } from '@/models/User';
import { ApiResponse } from '@/types/ApiResponse';
import dayjs from 'dayjs'
import { X } from 'lucide-react';


type MessageCardProps={
    message:Message,
    onDeleteMessage:(id:string)=>void
}

export default function MsgCard({message,onDeleteMessage}:MessageCardProps) {
    const {toast} = useToast()
    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
            if(!response.data.success){
                toast({
                    title:"Error",
                    description:response.data?.message,
                    variant:'destructive'
                })
            }
            toast({
                title:"Success",
                description:response.data?.message ?? "Error in deleting msg",
                variant:'default'
            })
            const id : string = message._id as string;
            onDeleteMessage(id);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title:"Error",
                description:axiosError.response?.data?.message,
                variant:'default'
            })
        }
    }
  return (
    <Card className="card-bordered">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{message.content}</CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='destructive'>
                <X className="w-5 h-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this message.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="text-sm">
          {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
        </div>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  )
}
