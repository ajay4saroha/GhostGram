import { z } from "zod";

export const userNameValidation = z
    .string()
    .min(2,"Username must be atleast 2 characters")
    .max(15,"Username must be atmost 15 characters")
    .regex(/^[a-zA-Z0-9_-]{3,16}$/,"User name consist of number and letters")

export const signUpSchema = z.object({
    username:userNameValidation,
    email:z.string().email({message:"Email should be valid"}),
    password:z.string().min(8,{message:"Password of must be 8 characters"})
})