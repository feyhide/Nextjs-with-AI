import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";


export async function DELETE(req:Request,{params}:{params: {messageId:string}}){
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user:User = session?.user
    const messageId = params.messageId
    
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

    try {
        const updateResult = await UserModel.deleteOne({_id:user._id},{$pull: {message:{_id:messageId}}})
        if(updateResult.deletedCount == 0){
            return Response.json(
                {
                    success:false,
                    message: "Message Already Deleted or Cannot be found"
                },
                {
                    status:404
                } 
            )
        }
        return Response.json(
            {
                success:true,
                message: "Message Deleted"
            },
            {
                status:200
            } 
        )
    } catch (error) {
        return Response.json(
            {
                success:false,
                message: "Error deleting messages"
            },
            {
                status:500
            } 
        )
    }
}