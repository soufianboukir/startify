'use client'


import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Loader } from 'lucide-react'
import { api } from '@/config/api'
import axios, { AxiosError } from 'axios'
import { useSession } from 'next-auth/react'

export const PasswordR = () => {
    const { update } = useSession()
    const [oldPassword,setOldPassword] = useState<string>('')
    const [password,setPassword] = useState<string>('')
    const [r_password,setR_password] = useState<string>('')
    const [loading,setLoading] = useState(false)
    const [reseted,setReseted] = useState(false)
    const [errors,setErrors] = useState({
        password: '',
        oldPassword: '',
        r_password: '',
        general: ''
    })

    const handleSubmit = async () =>{
        setErrors({password:'', oldPassword:'', r_password:'', general:''})
        setReseted(false)
        if(!oldPassword){
            setErrors(prev => ({ ...prev, oldPassword: 'Old password is required' }))
            return
        }
        if (!password) {
            setErrors(prev => ({ ...prev, password: 'Password is required' }))
            return
        }
        if (password.length < 8) {
            setErrors(prev => ({ ...prev, password: 'Password must be at least 8 characters' }))
            return
        }
        if (!r_password) {
            setErrors(prev => ({ ...prev, r_password: 'Repeat password is required' }))
            return
        }
        if (password !== r_password) {
            setErrors(prev => ({ ...prev, r_password: 'Passwords do not match' }))
            return
        }
        try{
            setLoading(true)
            const res = await api.put(`/user/settings/update-password`,{password,oldPassword,r_password})
            if(res.status === 200){
                setReseted(true)
                await update()
            }
        }catch(err){
            if (axios.isAxiosError(err)) {
                const axiosError = err as AxiosError<{ message: string }>;
            
                if (axiosError.response?.data?.message) {
                    setErrors({general: axiosError.response.data.message, password:'', r_password:'', oldPassword:''});
                } else {
                    setErrors({general: 'An error occured. please try again', password:'', r_password:'', oldPassword:''});
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
                    <h1 className='text-2xl font-semibold mb-3'>Reset password</h1>
                    <p className='text-sm mb-3'>
                        You can reset your password here
                    </p>

                    <div className="flex flex-col gap-4 rounded-md overflow-hidden w-[100%] md:w-[40%]">
                        <div>
                            <Input type='text' value={oldPassword} placeholder='Old password' onChange={(e) => setOldPassword(e.target.value)}/>
                            {errors.oldPassword && <p className='text-red-500 text-sm'>{errors.oldPassword}</p>}
                        </div>
                        <div>
                            <Input type='text' value={password} placeholder='New password' onChange={(e) => setPassword(e.target.value)}/>
                            {errors.password && <p className='text-red-500 text-sm'>{errors.password}</p>}
                        </div>
                        <div>
                            <Input type='text' value={r_password} placeholder='Retype new password' onChange={(e) => setR_password(e.target.value)}/>
                            {errors.r_password && <p className='text-red-500 text-sm'>{errors.r_password}</p>}
                        </div>
                    </div>
                    {
                        reseted && <p className='text-sm text-green-600 mt-3'>Your password has been reseted</p>
                    }
                    {
                        errors.general && <p className='text-sm text-red-500 mt-3'>{errors.general}</p>
                    }
                </div>
            </div>

            <div className='border-t mt-2 md:px-10 px-5 flex justify-between py-3 items-center'>
                <p className='text-sm dark:text-white/50 text-black/50'>Please use 8 characters at minimum.</p>
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