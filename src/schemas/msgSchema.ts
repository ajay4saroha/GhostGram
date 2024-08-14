import  {z} from 'zod'

export const msgSchema = z.object({
    content:z.string()
        .min(10,{message:'message must be atleast 10 characters'})
        .max(300,{message:'messages must be atmost 300 characters'})
})