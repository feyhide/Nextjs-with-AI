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
import { signIn } from 'next-auth/react'

const page = () => {
  const [isSubmitting,setisSubmitting] = useState(false)
  
  const { toast } = useToast()
  const router = useRouter()

  //zod implementation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      password: "",
      identifier: ""
    }
  })

  const onSubmit = async (data:z.infer<typeof signInSchema>) => {
    setisSubmitting(true)
    const result = await signIn("credentials",{
      redirect:false,
      identifier: data.identifier,
      password: data.password
    })

    if(result?.error){
      toast({
        title:"Login failed",
        description:"Incorrect credentials",
        variant:"destructive"
      })
    }

    if(result?.url){
      router.replace("/dashboard")
    }

    setisSubmitting(false)
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
        <div className='text-center'>
          <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
            join mystry message
          </h1>
          <p className='mb-4'>
            Sign in to start your anonymous adventure
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Email/Username" {...field}
                    />
                  </FormControl>
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
                ) : ("Sign In")
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