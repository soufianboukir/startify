'use client'


import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Session } from 'next-auth'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Copy, CopyCheck, Loader } from 'lucide-react'
import { toast } from 'sonner'
import axios, { AxiosError } from 'axios'
import { api } from '@/config/api'
import { useSession } from 'next-auth/react'

export const OtherDetails = ({ session }: { session: Session }) => {

    const { update } = useSession()
    const [website,setWebsite] = useState(session.user.website || '')
    const [headLine,setHeadLine] = useState(session.user.headLine || '')
    const [bio,setBio] = useState(session.user.bio || '')
    const [copied,setCopied] = useState(false)
    const [loading,setLoading] = useState(false)
    const [success,setSuccess] = useState(false)
    const [errors,setErrors] = useState({
        website: '',
        headLine: '',
        bio: '',
        general: ''
    })

    const copyToClipboard = () => {
        navigator.clipboard.writeText(session.user.headLine!)
        toast.success('Copied to clipboard')
        setCopied(true)
    }

    const handleSubmit = async () =>{
        setErrors({website:'', headLine:'', bio:'', general:''})
        setSuccess(false)
        if(!website){
            setErrors(prev => ({ ...prev, website: 'Try to change here' }))
            return
        }
        if (!headLine) {
            setErrors(prev => ({ ...prev, headLine: 'Try to change here' }))
            return
        }
        if (!bio) {
            setErrors(prev => ({ ...prev, bio: 'Try to change here' }))
            return
        }

        try{
            setLoading(true)
            const res = await api.put(`/user/settings/update-details`,{website,headLine,bio})
            if(res.status === 200){
                setSuccess(true)
                await update()
            }
        }catch(err){
            if (axios.isAxiosError(err)) {
                const axiosError = err as AxiosError<{ message: string }>;
            
                if (axiosError.response?.data?.message) {
                    setErrors({general: axiosError.response.data.message, website:'', headLine:'', bio:''});
                } else {
                    setErrors({general: 'An error occured. please try again', website:'', headLine:'', bio:''});
                }
            }
        }finally{
            setLoading(false)
        }
    }
    

    useEffect(() =>{
        setTimeout(() => {
            setCopied(false)
        }, 2000);
    },[copied])

    return (
        <div className='bg-muted/20 rounded-md pt-4 border'>
            <div className='flex justify-between items-center px-5 md:px-10'>
                <div className="w-full relative">
                    <h1 className='text-2xl font-semibold mb-3'>Other details</h1>
                    <p className='text-sm mb-3'>
                    This is your URL namespace within Startify.
                    </p>

                    <div className="flex flex-col gap-4 rounded-md overflow-hidden w-[100%]">
                        <div>
                            <Input type='text' value={website} placeholder='www.yourwesbite.com' onChange={(e) => setWebsite(e.target.value)}/>
                            {errors.website && <p className='text-red-500 text-sm'>{errors.website}</p>}
                        </div>
                        <div>
                            <Input type='text' value={headLine} placeholder='eg., Developer & co-founder' onChange={(e) => setHeadLine(e.target.value)}/>
                            {errors.headLine && <p className='text-red-500 text-sm'>{errors.headLine}</p>}
                        </div>
                        <div>
                            <Textarea className='w-[100%]' value={bio} placeholder='long description about you..' onChange={(e) => setBio(e.target.value)}/>
                            {errors.bio && <p className='text-red-500 text-sm'>{errors.bio}</p>}
                        </div>

                        {
                            errors.general && <p className='text-red-500 text-sm'>{errors.general}</p>
                        }
                        {
                            success && <p className='text-green-600 text-sm'>Your data has been updated successfully</p>
                        }

                        <div className='flex flex-col items-start justify-start gap-1 w-full md:w-[40%]'>
                            <span className='dark:text-white/50 text-black/50 text-sm text-left'>
                                User ID used when interacting with the Startify API.
                            </span>

                            <div className='relative w-full'>
                                <Input
                                    type='text'
                                    readOnly
                                    onChange={() => {}}
                                    defaultValue={"82934j23iu89535"}
                                    className='pr-10 cursor-pointer'
                                />
                                <button
                                    onClick={copyToClipboard}
                                    type='button'
                                    className='absolute right-2 top-1/2 -translate-y-1/2 dark:text-white/50 text-black/50 hover:text-black/40 dark:hover:text-white/40 cursor-pointer transition'
                                >
                                    {
                                        copied ?
                                        <CopyCheck className='text-green-700 w-4 h-4'/>
                                        : <Copy className='w-4 h-4' />
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
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