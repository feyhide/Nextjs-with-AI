import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import {z} from 'zod'

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(req:Request){
    await dbConnect()
    try {
        const {searchParams} = new URL(req.url)
        const queryParam = {
            username: searchParams.get("username")
        }
        //validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam)
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json(
                {
                    success:false,
                    message:usernameErrors?.length > 0 ? 
                            usernameErrors.join(", ")
                            : "invalid query parameters"
                },{status:400}
            ) 
        }

        const {username} = result.data

        const existingVerifiedUser = await UserModel.findOne({username,isVerified:true})
        if(existingVerifiedUser){
            return Response.json(
                {
                    success:false,
                    message:"username already taken"
                },{status:400}
            )
        }else{
            return Response.json(
                {
                    success:true,
                    message:"username is available"
                },{status:500}
            )
        }
    } catch (error) {
        console.error("ERROR CHECKING USERNAME",error)
        return Response.json(
            {
                success:false,
                message:"ERROR CHECKING USERNAME"
            },{status:500}
        )
    }
}