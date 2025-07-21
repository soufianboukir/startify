import { ModifyAvatar } from '@/components/settings/avatar'
import { OtherDetails } from '@/components/settings/headLine-bio-website'
import { ModifyName } from '@/components/settings/name'
import { ModifyUsername } from '@/components/settings/username'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import React from 'react'

export default async function Page () {
    const session = await getServerSession(authOptions)
    
    if(!session) return null

    return (
        <div className='pt-20 lg:w-[70%] md:w-[80%] mx-auto w-[95%]'>
            <h1 className='text-3xl font-semibold'>Account settings</h1>
            <br />
            <div className='flex flex-col gap-5'>
                <ModifyAvatar session={session}/>
                <ModifyName session={session}/>
                <ModifyUsername session={session}/>
                <OtherDetails session={session}/>
            </div>
        </div>
    )
}

