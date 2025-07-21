'use client'


import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

export const PasswordR = () => {

    const [oldPassword,setOldPassword] = useState<string>('')
    const [password,setPassword] = useState<string>('')
    const [r_password,setR_password] = useState<string>('')

    return (
        <div className='bg-muted/20 rounded-md pt-4 border'>
            <div className='flex justify-between items-center px-5 md:px-10'>
                <div className="w-full relative">
                    <h1 className='text-2xl font-semibold mb-3'>Reset password</h1>
                    <p className='text-sm mb-3'>
                        You can reset your password here
                    </p>

                    <div className="flex flex-col gap-4 rounded-md overflow-hidden w-[100%] md:w-[40%]">
                        <Input type='text' value={oldPassword} placeholder='Old password' onChange={(e) => setOldPassword(e.target.value)}/>
                        <Input type='text' value={password} placeholder='New password' onChange={(e) => setPassword(e.target.value)}/>
                        <Input type='text' value={r_password} placeholder='Retype new password' onChange={(e) => setR_password(e.target.value)}/>
                    </div>
                </div>
            </div>

            <div className='border-t mt-2 md:px-10 px-5 flex justify-between py-3 items-center'>
                <p className='text-sm dark:text-white/50 text-black/50'>Please use 8 characters at minimum.</p>
                <Button>
                    Save
                </Button>
            </div>
        </div>
    )
}