import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import {User} from 'next-auth'
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET(req:Request){
    try {
        await dbConnect();
        const session = await getServerSession(authOptions)
        const user : User = session?.user as User;
        if(!session || !session.user){
            return Response.json({
                success:false,
                message:"Not Logged In"
            },{status:400})
        }
        const userId = new mongoose.Types.ObjectId(user._id);
        const dbUser = await UserModel.aggregate([
            {
                $match:{
                    id:userId
                }
            },
            {
                $unwind:'$messages'
            },
            {
                $sort:{
                    'messages.createdAt':-1
                }
            },
            {
                $group:{
                    _id:'$_id',
                    messages:{
                        $push:'$messages'
                    }
                }
            }
        ])
        if(!dbUser || dbUser.length===0){
            return Response.json({
                success:false,
                message:"user not found"
            },{status:404})
        }

        return Response.json({
            success:true,
            messages:dbUser[0].messages
        },{status:200})
    } catch (error) {
        console.log("Error occured in get-messages--->",error);
        return Response.json({
            success:false,
            message:"Internal Server Error"
        },{status:500})
    }
}