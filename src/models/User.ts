import mongoose,{Schema,Document} from "mongoose";

export interface Message extends Document{
    content:string,
    createdAt:Date
}

const MessageSchema : Schema<Message> = new Schema({
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now()
    }
}) 

export interface User extends Document{
    username:string,
    name:string,
    email:string,
    password:string,
    verifyCode:string,
    isVerified:boolean,
    verifyCodeExpiry:Date,
    isAcceptingMessage:boolean,
    messages:Message[]
}

const UserSchema :Schema<User> = new Schema({
    username:{
        type:String,
        trim:true,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:true,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        ,"Not Valid email"]
    },
    password:{
        type:String,
        required:[true,"Password is not null"],
    },
    verifyCode:{
        type:String,
        required:true,
    },
    isVerified:{
        type:Boolean,
        required:true,
        default:false,
    },
    verifyCodeExpiry:{
        type:Date,
        required:true,
    },
    isAcceptingMessage:{
        type:Boolean,
        default:true
    },
    messages:[MessageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User",UserSchema))

export default UserModel;