import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(req:Request){
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user:User = session?.user

    if(!session || !session.user){
        return Response.json(
            {
                success:false,
                message: "Not Authenicated"
            },
            {
                status:401
            } 
        )
    }
    
    const userId = user._id
    const {acceptMessages} = await req.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId,{isAcceptingMessage:acceptMessages},{new:true})
        if(!updatedUser){
            return Response.json(
                {
                    success:false,
                    message: "failed to update user status to accept messages"
                },
                {
                    status:401
                } 
            )
        }

        return Response.json(
            {
                success:true,
                message: "messages accepting status updating successfully",
                updatedUser
                
            },
            {
                status:200
            } 
        )
    } catch (error) {
        console.log("failed to update user status to accept messages")
        return Response.json(
            {
                success:false,
                message: "failed to update user status to accept messages"
            },
            {
                status:500
            } 
        )
    }
}

export async function GET(req:Request){
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user:User = session?.user

    if(!session || !session.user){
        return Response.json(
            {
                success:false,
                message: "Not Authenicated"
            },
            {
                status:401
            } 
        )
    }
    
    const userId = user._id
    try {
        const foundUser = await UserModel.findById(userId)
        if(!foundUser){
            return Response.json(
                {
                    success:false,
                    message: "User Not Found"
                },
                {
                    status:404
                } 
            )
        }
        
        return Response.json(
            {
                success:true,
                isAcceptingMessages:foundUser.isAcceptingMessage
            },
            {
                status:401
            } 
        )

    } catch (error) {
        console.log("failed to get user status to accept messages")
        return Response.json(
            {
                success:false,
                message: "failed to get user status to accept messages"
            },
            {
                status:500
            } 
        )
    }
}