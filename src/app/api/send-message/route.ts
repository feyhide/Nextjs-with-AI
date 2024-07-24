import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(req:Request){
    await dbConnect()
    const {username,content} = await req.json()
    try {
        const user = await UserModel.findOne({username})
        if(!user){
            return Response.json(
                {
                    success:false,
                    messages: "user not found"
                },
                {
                    status:404
                } 
            )
        }

        // is user accepting messages 

        if(!user.isAcceptingMessage){
            return Response.json(
                {
                    success:false,
                    messages: "user is not accepting the messages"
                },
                {
                    status:403
                } 
            )
        }

        const newMessage = {content,createdAt: new Date()}

        user.message.push(newMessage as Message)
        await user.save()

        return Response.json(
            {
                success:true,
                messages: "message send successfully"
            },
            {
                status:500
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