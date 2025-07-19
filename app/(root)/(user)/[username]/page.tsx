import { dbConnection } from '@/config/db'
import User from '@/models/user'
import { notFound } from 'next/navigation'
import React from 'react'


export default async function Page({ params }: { params: Promise<{ username: string }> }) {

    const { username } = await params
    await dbConnection()
    const user = await User.findOne({ username})

    if(!user){
        return notFound();
    }
    return (
        <div className='pt-20'>
            <p>Searching for {username}</p>
        </div>
    )
}

