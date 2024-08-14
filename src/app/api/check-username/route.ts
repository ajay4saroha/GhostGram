import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import UserModel from "@/models/User";
import { userNameValidation } from "@/schemas/signUpSchema";
import { NextRequest } from "next/server";

const UsernameQuerySchema = z.object({
    username:userNameValidation
})

export async function GET(req:NextRequest){
    try {
        await dbConnect();
        console.log(req.url);
        // return
        const {searchParams} = new URL(req.url)

        const queryParam = {
            username:searchParams.get('username')
        }

        const result = UsernameQuerySchema.safeParse(queryParam) 
        // console.log("Query Params :",result)

        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success:false,
                message:usernameErrors.length>0 ? usernameErrors.join(' ,'):"Bad request for username"
            },{status:400})
        }
        // console.log(result.data)
        const {username} = result.data
        // console.log(username)
        const user = await UserModel.find({username:username,isVerified:true})
        // console.log(user.length);
        if(user.length){
            return Response.json({
                success:false,
                message:"Username already exist!"
            },{status:402})
        }

        return Response.json({
            success:true,
            message:"Username available"
        },{status:200})
    } catch (error) {
        console.log("Error username checker",error)
        return Response.json({
            success:false,
            message:"Error in checking username"
        },{status:500})
    }
}