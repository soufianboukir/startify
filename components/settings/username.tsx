
'use client'

import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Session } from 'next-auth'
import { Input } from '../ui/input'
import axios, { AxiosError } from 'axios'
import { api } from '@/config/api'
import { Loader } from 'lucide-react'
import { useSession } from 'next-auth/react'

export const ModifyUsername = ({ session }: { session: Session }) => {
    const [username,setUsername] = useState(session.user.username || '')
    const [error,setError] = useState('');
    const [success,setSuccess] = useState(false)
    const [loading,setLoading] = useState(false)
    const { update } = useSession()

    const handleSubmit = async () =>{
        setError("")
        setSuccess(false)
        if(!username || username === session.user.name){
            setError("Try to change here")
            return
        }
        if(username.length > 48){
            setError("48 characters at max")
            return
        }
        try{
            setLoading(true)
            const res = await api.put(`/user/settings/update-username`,{username})
            if(res.status === 200){
                setSuccess(true)
                await update()
            }
        }catch(err){
            if (axios.isAxiosError(err)) {
                const axiosError = err as AxiosError<{ message: string }>;
            
                if (axiosError.response?.data?.message) {
                    setError(axiosError.response.data.message);
                } else {
                    setError('An error occured. please try again');
                }
            }
        }finally{
            setLoading(false)
        }
    }
    return (
        <div className='bg-muted/20 rounded-md pt-4 border'>
            <div className='flex justify-between items-center px-5 md:px-10'>
                <div className="w-full relative">
                    <h1 className='text-2xl font-semibold mb-3'>Username</h1>
                    <p className='text-sm mb-3'>
                    This is your URL namespace within Startify.
                    </p>

                    <div className="flex items-center border rounded-md overflow-hidden w-[100%] md:w-[40%]">
                        <span className="dark:text-white/50 px-3 text-sm select-none border-r">
                            startify.vercel.three.app.com/
                        </span>
                        <Input
                            onChange={(e) => setUsername(e.target.value)}
                            type="text"
                            value={username}
                            className="flex-1 px-3 py-2 bg-white text-sm focus:outline-none rounded-bl-none rounded-tl-none"
                            placeholder="Enter your username"
                        />
                    </div>
                    {error && <span className='text-red-500 text-sm'>{error}</span>}
                    {success && <span className='text-green-600 text-sm'>Your username has been updated</span>}
                </div>
            </div>

            <div className='border-t mt-2 md:px-10 px-5 flex justify-between py-3 items-center'>
                <p className='text-sm dark:text-white/50 text-black/50'>Please use 48 characters at maximum.</p>
                <Button onClick={handleSubmit} disabled={loading}>
                    {
                        loading ? 
                            <>
                                <Loader className='w-4 h-4 animate-spin' /> saving
                            </>
                        :"Save"
                    }
                </Button>
            </div>
        </div>
    )
}