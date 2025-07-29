'use client'
import React, { useEffect, useState } from 'react'
import { Loader, MessageCircle } from 'lucide-react'
import { api } from '@/config/api'

type CommentsLengthProps = {
  ideaId: string
}

export function CommentsLength({ ideaId }: CommentsLengthProps) {
    const [count, setCount] = useState<number | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchCount() {
        setLoading(true)
            try {
                const res = await api.get(`/comments/count?ideaId=${ideaId}`)
                if(res.status === 200){
                    setCount(res.data.count)
                }
            } catch {
                setCount(0)
            } finally {
                setLoading(false)
            }
        }
        fetchCount()
    }, [ideaId])

    if (loading) {
        return (
        <div className='flex items-center gap-1 rounded-full px-3 py-1 bg-gray-100 dark:bg-muted/90 text-black dark:text-white'>
            <Loader className='w-4 h-4 animate-spin' />
            <span className='text-xs font-semibold'>Loading...</span>
        </div>
        )
    }

    return (
        <div className='flex items-center gap-1 rounded-full px-3 py-1 bg-gray-100 dark:bg-muted/90 text-black dark:text-white'>
            <MessageCircle className='w-4 h-4' />
            <span className='text-xs font-semibold'>{count}</span>
        </div>
    )
}
