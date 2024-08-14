import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from 'bcrypt';
import { sendVerificationEmail } from "@/services/sendVerificationCode";

export async function POST(req:Request) {
    await dbConnect();

    try {
        const {username,email,password} = await req.json();
        const existingVerifiedUser= await UserModel.findOne({username,isVerified:true})
        ////////////   New User or not /////////
        if(existingVerifiedUser){
            return Response.json({
                success:false,
                message:"User already Exist with same username"
            },{status:402})
        }

        const existingUserWithEmail = await UserModel.findOne({email})
        const verficationCode = Math.floor(100000+Math.random() * 900000).toString();
        if(existingUserWithEmail){
            if(existingUserWithEmail.isVerified){
                return Response.json({
                    success:false,
                    message:"User Already Exist with same email"  
                },{status:400})
            } else {
                const hp = await bcrypt.hash(password,10);
                existingUserWithEmail.password = hp;
                existingUserWithEmail.verifyCode,
                existingUserWithEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
            }
        } 
        else {
                /////// New User ////////
            
            const hashedPass = await bcrypt.hash(password,10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours()+1);

            const newUser = new UserModel({
                username,
                email,
                password:hashedPass,
                verifyCode:verficationCode,
                verifyCodeExpiry:expiryDate,
                isVerified:false,
                isAcceptingMessage:true,
                messages:[]
            });

            await newUser.save();
        }
        

        //// email send for verfication

        const emailRes = await sendVerificationEmail(email,username,verficationCode)

        if(!emailRes.success){
            return Response.json({
                success:false,
                message:emailRes.message
            },{
                status:408
            })
        }
        return Response.json({
            success:true,
            message:"User Registed Success!"
        },{
            status:200
        })
    } catch (error) {
        console.log("Error in signup ",error);
        return Response.json({
            success:false,
            message:"Error in registering user"
        },
        {
            status:500
        }
    )
    }
}