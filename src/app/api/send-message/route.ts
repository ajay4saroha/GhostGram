import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { Message } from "@/models/User";

export async function POST(req:Request){
    try {
        await dbConnect();
        const {username,msg} = await req.json()
        const user = await UserModel.findOne({username})
        if(!msg.trim()){
            return Response.json({
                success:false,
                message:"Empty Message"
            },{status:401})
        }
        if(!user){
            return Response.json({
                success:false,
                message:"username not found"
            },{status:404})
        }

        if(!user.isAcceptingMessage){
            return Response.json({
                success:false,
                message:"user not accepting messages"
            },{status:402})
        }
        const newMsg = {
            content:msg.trim(),
            createdAt:new Date()
        }
        user.messages.push(newMsg as Message)
        await user.save()
        return Response.json({
            success:true,
            message:`Message sent to ${username}`
        },{status:200})
    } catch (error) {
        console.log('Error occured on send-message : ',error);
        return Response.json({
            success:false,
            message:"Internal Server Error"
        },{status:500})
    }
}