"use client"
import { User } from '@/models/User';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'
import React from 'react'
export default function HomePage() {
  const router = useRouter();
  const {data:session} = useSession()
  const user :User = session?.user as User
  return (
    <>
   <div className="h-screen w-full flex justify-center items-center bg-gradient-to-b from-gray-900 to-gray-700">
  <div className="p-4 text-center z-10 w-full relative">
    <h1 className="text-4xl font-bold bg-clip-text bg-gradient-to-b from-purple-500 to-purple-300 text-transparent">
      Send Secrets, Receive Truths.
    </h1>
    <p className="mt-4 font-normal text-base text-gray-400 max-w-lg mx-auto">
      Share your thoughts, feelings, and confessions with others without fear of judgment. Our app allows you to send anonymous messages to anyone, while maintaining your privacy and security.
    </p>
    
  </div>
</div>
    </>
  )
}
