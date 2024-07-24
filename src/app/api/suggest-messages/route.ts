import OpenAI from "openai";
import {OpenAIStream,StreamingTextResponse} from 'ai'
import { NextResponse } from "next/server";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

export const runtime = 'edge'

export async function POST(req:Request){
    try {
        const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'."
        const response = await openai.completions.create({
            model:"gpt-3.5-turbo-instruct",
            stream:true,
            max_tokens:400,
            prompt
        })
        const stream = OpenAIStream(response)
        return new StreamingTextResponse(stream)
    } catch (error) {
        if(error instanceof OpenAI.APIError){
            const {name,status,headers,message} = error
            return NextResponse.json({
                name,status,headers,message
            },{status})
        }else{
            console.error("An unexpected error occured")
            throw error
        }
    }
}