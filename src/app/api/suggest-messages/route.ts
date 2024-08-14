import {createOpenAI} from '@ai-sdk/openai'
import { generateText } from 'ai'
export async function POST(req:Request){
    try {
        const openai=createOpenAI({
            compatibility:'strict',
            apiKey:process.env.OPENAI_API_KEY
        })

        const model = openai.completion('gpt-3.5-turbo-instruct')
        const {text } = await generateText({
            model,
            prompt:"Suggesst me some name for my ecommerce website"
        })
        console.log(text);
    } catch (error) {
        console.log("Error occured on suggest-messages route : ",error)
        return Response.json({
            success:false,
            message:"Internal Server Error"
        },{status:500})
    }
}