import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Session } from 'next-auth'

export const ModifyAvatar = ({session}: {session: Session}) => {
    return (
        <div className='bg-muted/20 rounded-md pt-4 border'>
            <div className='md:flex block justify-between items-center px-5 md:px-10'>
                <div>
                    <h1 className='text-2xl font-semibold mb-3'>Avatar & Email</h1>
                    <p className='text-sm'>This is your avatar. </p>
                    <p className='text-sm'>Click on the avatar to upload a custom one from your files.</p>
                    <div className='px-3 py-2 rounded-md border mt-4 flex items-center gap-2'>
                        <p>{session.user.email}</p>
                        <span className='bg-green-700 text-green-200 font-semibold text-xs px-3 py-1 rounded-full'>verified</span>
                        <span className='bg-blue-600 text-blue-200 font-semibold text-xs px-3 py-1 rounded-full'>primary</span>
                    </div>
                </div>

                <div>
                    <Avatar className="cursor-pointer md:w-26 mt-4 md:h-26 h-14 w-14">
                        {
                            session?.user.image && <AvatarImage src={session?.user.image} />
                        }
                        <AvatarFallback>{session?.user.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                </div>
            </div>

            <div className='border-t py-4 mt-2 md:px-10 px-5'>
                <p className='text-sm dark:text-white/50 text-black/50'>An avatar is optional but strongly recommended.</p>
            </div>
        </div>
    )
}
