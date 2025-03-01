"use client"
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { signUpSchema } from '@/schemas/signUpSchema'
import { verifySchema } from '@/schemas/verifySchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import {useForm } from 'react-hook-form'
import * as z from 'zod'


const VerifyAccount = () => {
    const router = useRouter()
    const param = useParams<{username: string}>()
    const {toast} = useToast()
    const [isSubmitting,setisSubmitting] = useState(false)
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        setisSubmitting(true)
        try {
            const response = await axios.post(`/api/verify-code`,{
                username: param.username,
                code: data.code
            })
            toast({
                title:"success",
                description: response.data.message
            })
            setisSubmitting(false)
            router.replace("/sign-in")
        } catch (error) {
            console.error("error in signin of user",error)
            const axiosError = error as AxiosError<ApiResponse>
            let errorMessage = axiosError.response?.data.message
            toast({
                title:"SignUp Failed",
                description: errorMessage,
                variant: "destructive"
            })
            setisSubmitting(false)
        }
    }

    return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
        <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
            <div className='text-center'>
            <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
                verify your account
            </h1>
            <p className='mb-4'>
                enter your verification code
            </p>
            </div>
            <Form {...form}>
                <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        name="code"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Verification Code</FormLabel>
                                <FormControl>
                                    <Input placeholder="code" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                    )}
                    />
                    <Button type="submit">
                        {isSubmitting ? (<Loader2 className='animate-spin'/>):("Submit")}
                    </Button>
                </form>
            </Form>
        </div>
    </div>
  )
}

export default VerifyAccount