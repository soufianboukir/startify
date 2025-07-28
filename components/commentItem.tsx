import { Comment } from '@/interfaces/comment'
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { formatDistanceToNow } from 'date-fns'
import { CommentActions } from './comment-menu'
import { Session } from 'next-auth'
import { toast } from 'sonner'
import { api } from '@/config/api'
import Link from 'next/link'

type CommentItemProps = {
    comment: Comment
    session: Session
}

export const CommentItem = ({ comment, session }: CommentItemProps) => {
    
    const [disableLike,setDisableLike] = useState(false)

    const toggleLike = async () => {
        setDisableLike(true)
        const res = await api.patch(`/comments/like`,{commentId: comment._id})
        setDisableLike(false)
        return res
    }

    const [likes,setLikes] = useState(comment.likes?.length) 


    const handleLiking = () =>{
        toast.promise(toggleLike, {
            loading: '...loading',
            success: (res) => {
                if( res.data.message === 'Comment liked'){
                    setLikes(comment.likes?.length + 1)
                }else{
                    setLikes(likes - 1)
                }
                return res.data.message
            },
            error: (err) => err.response.data.message
        })
    }
    return (
        <div>
            <div className='flex justify-between'>
                <div className="flex gap-2 items-center">
                    <Avatar className="cursor-pointer w-6 h-6">
                        <AvatarImage src={comment?.author?.image} />
                        <AvatarFallback>{comment?.author?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <Link className="hover:underline duration-100 font-semibold text-sm" href={`/${comment.author?.username}`}>{comment?.author?.username}</Link>

                    <span className="dark:text-white/50 text-black/50 text-[12px]">
                        {formatDistanceToNow(comment?.createdAt, { addSuffix: true })}
                    </span>
                </div>

                <CommentActions isCurrentUser={session.user.id === comment?.author?._id} commentId={comment._id!}/>
            </div>
            <div className="mt-1 ml-8">
                <p className="text-sm dark:text-white/50">{comment.content}</p>
            </div>

            <div className='md:flex md:flex-row flex-col gap-4 mt-1'>
                <div className='flex gap-2'>
                    <button onClick={handleLiking} disabled={disableLike} className='cursor-pointer'>
                        <span className="text-sm ml-8 dark:text-white/50 text-black/50 underline">{likes} Like</span>
                    </button>
                </div>
            </div>
            <hr className='mt-2'/>
        </div>
    )
}
