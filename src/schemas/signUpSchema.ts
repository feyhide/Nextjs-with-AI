import {z} from 'zod'

export const usernameValidation = z
    .string()
    .min(2,"Username must be atleast 2 characters")
    .max(20,"Username no more than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/,"Username cannot contain special characters")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message:"Invalid Email Address"}),
    password: z.string().min(6,{message:"Username atleast be 6 characters"})
})