import { NextAuthOptions } from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import bcrypt from 'bcrypt';
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

export const authOptions:NextAuthOptions = {
   providers:[
       CredentialsProvider({
           id:"credentials",
           name:"credetials",
           credentials:{
               email:{
                   label:"Email",
                   type:"text"
               },
               password:{
                   label:"Password",
                   type:"password"
               },
           },
           async authorize(credentials:any):Promise<any> {
               await dbConnect();
               try {
                   const user = await UserModel.findOne({
                    $or:[
                        {
                            email:credentials.identifier
                        },
                        {
                            username:credentials.identifier
                        } 
                    ]
                   })
                   if(!user){
                    throw new Error("No user found with this email")
                   }

                   if(!user.isVerified){
                    throw new Error("Account is not verified. Do it!")
                   }

                   const matchPass = await bcrypt.compare(credentials.password,user.password)

                   if(matchPass){
                    return user;
                   }

                   throw new Error('Incorrect password')
               } catch  (err:any) {
                   throw new Error(err);
               }
           }
       })
   ],
   callbacks:{
    async session({session,user,token}){
        if(token){
            session.user._id = token._id;
            session.user.isVerified = token.isVerified;
            session.user.isAcceptingMessages=token.isAcceptingMessages;
            session.user.username = token.username;
        }
        return session
    },
    async jwt({user,token}){
        if(user){
            token._id = user._id?.toString()
            token.isVerified = user.isVerified;
            token.isAcceptingMessages = user.isAcceptingMessages;
            token.username=user.username
        }
        return token
    }
   },
   pages:{
    signIn:'/sign-in',
    signOut:'/',
   },
   session:{
    strategy:'jwt'
   },
   secret:process.env.NEXTAUTH_SECRET
}