'use client'

import { Session } from 'next-auth'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { api } from '@/config/api'
import { Loader } from 'lucide-react'
import { useSession } from 'next-auth/react'

export const ModifyName = ({session}: {session: Session}) => {
    const { update } = useSession()
    const [name,setName] = useState<string>(session.user.name || '')
    const [error,setError] = useState('');
    const [success,setSuccess] = useState(false)
    const [loading,setLoading] = useState(false)

    const handleSubmit = async () =>{
        setError("")
        setSuccess(false)
        if(!name || name === session.user.name){
            setError("Try to change here")
            return
        }
        if(name.length > 32){
            setError("32 characters at max")
            return
        }
        try{
            setLoading(true)
            const res = await api.put(`/user/settings/update-name`,{name})
            if(res.status === 200){
                setSuccess(true)
                await update()
            }
        }catch{
            setError("An error occured please try again")
        }finally{
            setLoading(false)
        }
    }
    return (
    <div className='bg-muted/20 rounded-md pt-4 border'>
        <div className='flex justify-between items-center px-5 md:px-10'>
            <div>
                <h1 className='text-2xl font-semibold mb-3'>Display name</h1>
                <p className='text-sm mb-3'>Please enter your full name, or a display name you are comfortable with. </p>
                <div>
                    <Input type='text' value={name} className='mb-3' onChange={(e) => setName(e.target.value)}/>
                    {error && <span className='text-red-500 text-sm'>{error}</span>}
                    {success && <span className='text-green-600 text-sm'>Your name has been updated</span>}
                </div>
            </div>
        </div>

        <div className='border-t mt-2 md:px-10 px-5 flex justify-between py-3 items-center'>
            <p className='text-sm dark:text-white/50 text-black/50'>Please use 32 characters at maximum.</p>
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
