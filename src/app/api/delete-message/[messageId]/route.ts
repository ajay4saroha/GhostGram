import dbConnect from "@/lib/dbConnect"
import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import UserModel, { User } from "@/models/User";


export async function DELETE(req:Request,{params}:{params:{messageId:string}}){
    try {
        await dbConnect();
        const session = await getServerSession(authOptions)
        const user :User = session?.user as User
        const messageId = params.messageId
        if(!session || !session?.user){
            return Response.json({
                success:false,
                message:"Not authenticated"
            },{status:402})
        }
        const dbUser = await UserModel.updateOne(
            {_id:user._id},
            {$pull:{messages:{_id:messageId}}},
        )
        if(dbUser.modifiedCount===0){
            return Response.json({
                success:false,
                message:"Message already delete"
            },{status:404})
        }
        return Response.json({
            success:true,
            message:"Message Deleted Success"
        },{status:200})
    } catch (error) {
        console.log("Error in delete message route :",error)
        return Response.json({
            success:false,
            message:"Internal Server Error"
        },{status:500})
    }
}