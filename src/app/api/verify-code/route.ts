import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
export async function POST(req:Request){
    try {
        await dbConnect();
        const {username,code} = await req.json();
        // console.log(username,code);
        const user = await UserModel.findOne({username:username});
        if(!user){
            return Response.json({
                success:false,
                message:"User not found"
            },{status:404})    
        } 
        if(user.isVerified){
            return Response.json({
                success:false,
                message:"Already verified"
            },{status:302})
        }
        if(user.verifyCode!==code){
            return Response.json({
                success:true,
                message:"Incorrect Code"
            },{status:402})
        }
        const isCodeExipred = new Date(user.verifyCodeExpiry) < new Date(Date.now())
        // console.log("Check:",isCodeExipred)
        if(isCodeExipred){
            return Response.json({
                success:false,
                message:"Code Expired"
            },{status:405})
        }
        user.isVerified = true
        await user.save();
        return Response.json({
            success:true,
            message:"Verifcation successful"
        },{status:200})
    } catch (error) {
        console.log("Error occured in verifying code");
        return Response.json({
            success:false,
            message:"Internal Server Error"
        },{status:500})
    }
}