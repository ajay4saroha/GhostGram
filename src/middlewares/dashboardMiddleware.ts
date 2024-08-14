import { NextResponse } from "next/server"

export const dashboardMiddeware = async(req:Request)=>{
    console.log("Hi from dashboard middleware")
    return NextResponse.next()
}