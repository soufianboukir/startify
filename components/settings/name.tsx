'use client'

import { Session } from 'next-auth'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

export const ModifyName = ({session}: {session: Session}) => {
    const [name,setName] = useState<string>(session.user.name || '')
    return (
    <div className='bg-muted/20 rounded-md pt-4 border'>
        <div className='flex justify-between items-center px-5 md:px-10'>
            <div>
                <h1 className='text-2xl font-semibold mb-3'>Display name</h1>
                <p className='text-sm mb-3'>Please enter your full name, or a display name you are comfortable with. </p>
                <Input type='text' value={name} className='mb-3' onChange={(e) => setName(e.target.value)}/>
            </div>
        </div>

        <div className='border-t mt-2 md:px-10 px-5 flex justify-between py-3 items-center'>
            <p className='text-sm dark:text-white/50 text-black/50'>Please use 32 characters at maximum.</p>
            <Button>
                Save
            </Button>
        </div>
    </div>
    )
}
