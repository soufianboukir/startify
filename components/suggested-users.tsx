'use client'

import { api } from '@/config/api'
import { User } from '@/interfaces/user'
import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback } from './ui/avatar'
import { AvatarImage } from '@radix-ui/react-avatar'
import { FollowButton } from './follow-btn'
import Link from 'next/link'

export const SuggestedUsers = () => {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)

    const getSuggestedUser = async () => {
        try {
            setLoading(true)
            const res = await api.get(`/feed/suggested`)
            if (res.status === 200) {
                setUsers(res.data.users)
            }
        } catch {
            // handle error if needed
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getSuggestedUser()
    }, [])

    if (loading) return null

    return (
        <div className="sticky top-4 w-full dark:bg-muted/30 bg-gray-50 rounded-lg px-4 py-3 shadow-xs">
            <h1 className="text-lg font-semibold mb-3">Suggested for you</h1>
            <div className="space-y-4">
                {
                    users?.length > 0 && users.map((user) => (
                        <div key={user._id} className="flex justify-between">
                            <div className='flex items-center gap-2'>
                                <Avatar className="w-7 h-7">
                                    <AvatarImage src={user.image || ''} />
                                    <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <Link className="font-medium text-sm hover:underline duration-200" href={`/${user.username}`}>{user.name}</Link>
                                    <span className="text-xs text-muted-foreground">{user.headLine}</span>
                                </div>
                            </div>

                            <FollowButton userId={user._id!} onlySVG={true} isFollowing={false}/>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
