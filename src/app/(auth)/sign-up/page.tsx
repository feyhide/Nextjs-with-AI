"use client"

import axios, { AxiosError } from 'axios'
import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from 'next/link'
import { useDebounceCallback, useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation'
import { signInSchema } from '@/schemas/signInSchema'
import { signUpSchema } from '@/schemas/signUpSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader, Loader2 } from 'lucide-react'

const page = () => {
  const [username,setUsername] = useState("")
  const [usernameMessage,setUsernameMessage] = useState('')
  const [isCheckingusername,setisCheckingusername] = useState(false)
  const [isSubmitting,setisSubmitting] = useState(false)
  
  const debounced = useDebounceCallback(setUsername,400)
  const { toast } = useToast()
  const router = useRouter()

  //zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      password: "",
      email: ""
    }
  })

  useEffect(()=>{
    const checkUsernameUnique = async () => {
      if(username){
        setisCheckingusername(true)
        setUsernameMessage('')
        try {
          const response = await axios.get(`/api/check-username-unique?username=${username}`)
          setUsernameMessage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>
          setUsernameMessage(axiosError.response?.data.message ?? "Error Checking Username")
        }finally {
          setisCheckingusername(false)
        }
      }else{
        setUsernameMessage('')
      }
    }
    checkUsernameUnique()

  },[username])
  
  const onSubmit = async (data:z.infer<typeof signUpSchema>) => {
    setisSubmitting(true)
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up',data)
      toast({
        title: "success",
        description: response.data.message
      })
      router.replace(`/verify/${username}`)
      setisSubmitting(false)
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
            join mystry message
          </h1>
          <p className='mb-4'>
            Sign up to start your anonymous adventure
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      debounced(e.target.value)
                    }}
                    />
                  </FormControl>
                  {isCheckingusername && <Loader2 className='animate-spin'/>}
                  <p className={`text-sm ${usernameMessage === "username is available" ? 'text-green-500' : "text-red-500"}`}>
                    {usernameMessage}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" type='password' {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' disabled={isSubmitting}>
              {
                isSubmitting ? (
                  <>
                  <Loader2 className='mr-2 h-4 animate-spin'/> Please Wait
                  </>
                ) : ("Sign Up")
              }
            </Button>
          </form>
        </Form>
        <div className='text-center mt-4'>
            <p>
              Already a member ? {""}
              <Link href='/sign-in' className="text-blue-600 hover:text-blue-800">
                Sign In
              </Link>
            </p>
        </div>
      </div>
    </div>
  )
}

export default page