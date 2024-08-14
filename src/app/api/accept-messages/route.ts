
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import {User} from 'next-auth'

export async function POST(req:Request){
    await dbConnect();
    try {
        const session = await getServerSession(authOptions)
        const user : User = session?.user as User;

        if(!session || !session.user){
            return Response.json({
                success:false,
                message:"Not Logged In"
            },{status:400})
        }

        // console.log("User Id : ",user._id)
        // return
        const userId = user?._id;
        const {isAcceptingMessages} = await req.json();

        const updatedUser = await UserModel.findByIdAndUpdate({_id:userId},{isAcceptingMessage:isAcceptingMessages},{new:true})

        if(!updatedUser){
            return Response.json({
                success:false,
                message:"Failed to update user message status"
            },{status:404})
        }
        
        return Response.json({
            success:true,
            message: isAcceptingMessages ? "Accepting Messages status update":"Not Accepting Messages status update",
            updatedUser
        },{status:200});

    } catch (error) {
        console.log("Error in accept-message route : ",error)
        return Response.json({
            success:true,
            message:"Internal Server Error"
        },{status:500})
    }
}

export async function GET(req:Request){
    await dbConnect();
    try {
        const session = await getServerSession(authOptions)
        const user : User = session?.user as User;
        // console.log(user);
        if(!session || !session.user){
            return Response.json({
                success:false,
                message:"Not Logged In"
            },{status:400})
        }
        const userId = user?._id;
        // console.log(userId)
        const dbUser = await UserModel.findOne({_id:userId});
        // console.log("DB USER : ",dbUser)
        // return
        if(!dbUser){
            return Response.json({
                success:false,
                message:"user not found"
            },{status:404})
        }

        return Response.json({
            success:true,
            message:"User found",
            isAcceptingMessages:dbUser.isAcceptingMessage
        },{status:200})
    } catch (error) {
        console.log("Error occured in accept -message route : ",error)
        return Response.json({
            success:false,
            message:"Internal Server Error"
        },{status:500})
    }
}