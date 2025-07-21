'use client'


import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Session } from 'next-auth'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Copy, CopyCheck } from 'lucide-react'
import { toast } from 'sonner'

export const OtherDetails = ({ session }: { session: Session }) => {

    const [website,setWebsite] = useState(session.user.website || '')
    const [headLine,setHeadLine] = useState(session.user.headLine || '')
    const [bio,setBio] = useState(session.user.bio || '')
    const [copied,setCopied] = useState(false)

    const copyToClipboard = () => {
        navigator.clipboard.writeText(session.user.headLine!)
        toast.success('Copied to clipboard')
        setCopied(true)
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
                        <Input type='text' value={website} placeholder='www.yourwesbite.com' onChange={(e) => setWebsite(e.target.value)}/>
                        <Input type='text' value={headLine} placeholder='eg., Developer & co-founder' onChange={(e) => setHeadLine(e.target.value)}/>
                        <Textarea className='w-[100%]' value={bio} placeholder='long description about you..' onChange={(e) => setBio(e.target.value)}/>

                        <div className='flex flex-col items-start justify-start gap-1 w-full md:w-[40%]'>
                            <span className='dark:text-white/50 text-black/50 text-sm text-left'>
                                User ID used when interacting with the Vercel API.
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
                <Button>
                    Save
                </Button>
            </div>
        </div>
    )
}