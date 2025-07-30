import React from 'react'
import { Mail } from 'lucide-react'
import Link from 'next/link'

export const MessageButton = ({ username }: {username: string}) => {
    return (
        <Link className='flex gap-2 items-center bg-inherit border dark:border-gray-600 font-medium cursor-pointer px-2 py-1 rounded-sm' href={`/inbox?username=${username}`}>
            <Mail className='w-4 h-4'/>
            Message
        </Link>
    )
}
