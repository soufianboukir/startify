import { dbConnection } from '@/config/db'
import Comment from '@/models/comment'
import { MessageCircle } from 'lucide-react'
import React from 'react'

const CommentsLength = async ({ ideaId }: { ideaId: string }) => {
    await dbConnection()
    const commentsLength = await Comment.countDocuments({idea: ideaId})

    return (
        <div className='dark:bg-muted/90 bg-gray-100 flex gap-1 rounded-full px-3 py-1 dark:text-white text-black items-center duration-200 dark:hover:bg-muted/60 hover:bg-gray-200'>
            <MessageCircle className='w-4 h-4' />
            <span className='text-xs font-semibold'>{commentsLength}</span>
        </div>
    )
}

export default CommentsLength
