import { resend } from "@/lib/resend";

import VerificationEmail from "../../emails/VerificationEmail";

import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email:string,
    username:string,
    verificationCode:string,
) : Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from:'onboarding@resend.com',
            to:email,
            subject:"GhostGram | Verfication Code",
            react:VerificationEmail({username,otp:verificationCode}),
        })
        return {success:true,message:"Sent Successfully"}
    } catch (error) {
        console.error("Error sending verfication email",error);
        return {success:false,message:"Failed to send"}
    }
}