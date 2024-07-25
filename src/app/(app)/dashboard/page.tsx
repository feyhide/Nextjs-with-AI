'use client'

import MessageCard from '@/components/MessageCard'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'
import { Message } from '@/model/User'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2, RefreshCcw } from 'lucide-react'
import { User } from 'next-auth'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

const page = () => {
  const [messages,setMessages] = useState<Message[]>([])
  const [isLoading,setisloading] = useState(false)
  const [isSwitchLoading,setIsSwitchLoading] = useState(false)

  const {toast} = useToast()

  const handleDeleteMessage = (messageId:string) => {
    setMessages(messages.filter((message)=>message._id !== messageId))

  }

  const {data:session} = useSession()

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  })

  const {register,watch,setValue} = form

  const acceptMessages = watch("acceptMessages")

  const fetchAcceptMessage = useCallback(async ()=> {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get("/api/accept-messages")
      setValue('acceptMessages',response.data.isAcceptingMessage)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title:"Error",
        description: axiosError.response?.data.message || "Failed to fetch messages settings",
        variant:"destructive"
      })
    } finally {
      setIsSwitchLoading(false)
    }
  },[setValue])

  const fetchMessages = useCallback(async (refresh:boolean=false)=>{
    setisloading(true)
    setIsSwitchLoading(false)
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages')
      setMessages(response.data.messages || [])
      if(refresh){
        toast({
          title:"Refreshed Messages",
          description: "Latest messages",
          variant:"destructive"
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title:"Error",
        description: axiosError.response?.data.message || "Failed to fetch messages settings",
        variant:"destructive"
      })
    } finally {
      setisloading(false)
      setIsSwitchLoading(false)
    }
  },[setisloading,setIsSwitchLoading])


  useEffect(()=>{
    if(!session || !session.user){
      return
    }

    fetchMessages()
    fetchAcceptMessage()
  },[session,setValue,fetchAcceptMessage,fetchMessages])
  
  const handleSwitchChange = async()=> {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages',{
        acceptMessages:!acceptMessages
      })
      setValue('acceptMessages',!acceptMessages)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title:"Error",
        description: axiosError.response?.data.message || "Failed to fetch messages settings",
        variant:"destructive"
      })
    }
  }

  const {username} = session?.user as User
  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const profileUrl = `${baseUrl}/u/${username}`

  const copytoclipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast({
      title:"Url Copied",
      description:"Profile Url copied"
    })
  }
  
  if(!session || !session.user){
    return <div>Please login</div>
  }

  return (
    <div className='my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl'>
      <h1 className='text-4xl font-bold mb-4'>User DashBoard</h1>
      <div className='mb-4'>
        <h2 className='text-lg font-semibold mb-2'>
          Copy your unique link
        </h2>
        <div className='flex items-center'>
          <input
            type='text'
            value={profileUrl}
            disabled
            className='input input-bordered w-full p-2 mr-2'
          />
          <Button onClick={copytoclipboard}>Copy</Button>
        </div>
      </div>
      <div className='mb-4'>
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className='ml-2'>
          Accept Messages : {acceptMessages ? "On" : "Off"}
        </span>
      </div>
      <Separator/>
      <Button className='mt-4'
        variant='outline'
        onClick={(e)=>{
          e.preventDefault()
          fetchMessages(true)
        }}
      >
        {isLoading ? (
          <Loader2 className='h-4 w-4 animate-spin'/>
        ) : (
          <RefreshCcw className='w-4 h-4'/>
        )}
      </Button>
      <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-6'>
        {messages.length > 0 ? (
          messages.map((message,index)=>(
            <MessageCard
              key={index}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ):(<p>No messages to display</p>)}
      </div>
    </div>
  )
}

export default page