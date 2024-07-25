import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";


export async function GET(req:Request){
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user = session?.user

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

    const userId = new mongoose.Types.ObjectId(user._id as string)

    try {
        const user = await UserModel.aggregate([
            {$match: {_id:userId}},
            {$unwind: "$message"},
            {$sort: {'message.createdAt':-1}},
            {$group: {_id: "$_id",message: {$push:"$message"}}}
        ])
        console.log(userId,user)
        if(!user || user.length === 0){
            return Response.json(
                {
                    success:false,
                    message: "User not found"
                },
                {
                    status:404
                } 
            )
        }
        return Response.json(
            {
                success:true,
                messages: user[0].message
            },
            {
                status:200
            } 
        )
    } catch (error) {
        return Response.json(
            {
                success:false,
                messages: error
            },
            {
                status:500
            } 
        )
    }
}