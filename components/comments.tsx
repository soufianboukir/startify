'use client'

import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Comment } from '@/interfaces/comment'
import { api } from '@/config/api'
import { Loader } from 'lucide-react'
import { toast } from 'sonner'
import { EmptyState } from './empty-state'
import { Session } from 'next-auth'
import { formatDistanceToNow } from 'date-fns'

export const Comments = ({ ideaId, session }: { ideaId: string, session: Session }) => {

    const [comments,setComments] = useState<Comment[]>([])
    const [loading,setLoading] = useState(true)
    const [page,setPage] = useState(1)
    const [comment,setComment] = useState('')
    const [posting,setPosting] = useState(false)
    const [totalComments,setTotalComments] = useState(0)
    const disableBtn = comment === ''

    useEffect(() => {
        const getComments = async () => {
            try {
                setLoading(true)
                const res = await api.get(`/comments/${ideaId}?page=${page}`)
                if (res.status === 200) {
                    const newComments = res.data.comments
                    setTotalComments(res.data.total)
    
                    setComments(prev =>
                        page === 1 ? newComments : [...prev, ...newComments]
                    )
                }
            } catch {
                // setError("An error occurred")
            } finally {
                setLoading(false)
            }
        }
    
        if (ideaId) {
            getComments()
        }
    }, [page, ideaId])


    const postComment = async () =>{
        if( comment === '') return
        try{
            setPosting(true)
            const res = await api.post(`/comments`,{content: comment, ideaId})
            if(res.status === 200){
                toast.success('Comment posted successfully')
                setComment('')
                setComments([{content:comment, author: {name: session.user.name!,
                    username: session.user.username,
                    image: session.user.image!}, createdAt: new Date()},...comments])
            }
        }catch{
            toast.error('An error occured. try again')
        }finally{
            setPosting(false)
        }
    }
    return (
        <div>
            <div className="flex gap-2">
                <Input type="text" placeholder="Post a comment" value={comment} onChange={(e) => setComment(e.target.value)}/>
                <Button className="bg-blue-600 hover:bg-blue-700 rounded-full text-white cursor-pointer" disabled={posting || disableBtn} onClick={postComment}>
                    {
                        posting ?
                            <><Loader className='animate-spin'/> posting</>
                        : "Post"
                    }
                </Button>
            </div>

            <div className="mt-6 flex flex-col gap-3">
                    {
                        comments && comments.length && !loading ? (
                            comments.map((comment) => (
                                <div key={comment._id}>
                                    <div className="flex gap-2 items-center">
                                        <Avatar className="cursor-pointer w-6 h-6">
                                            <AvatarImage src={comment.author.image} />
                                            <AvatarFallback>{comment.author.name?.charAt(0)}</AvatarFallback>
                                        </Avatar>

                                        <span className="hover:underline duration-100 font-semibold text-sm">{comment.author.username}</span>

                                        <span className="dark:text-white/50 text-black/50 text-[12px]">
                                            {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                                        </span>
                                    </div>
                                    <div className="mt-1 ml-8">
                                        <p className="text-xs dark:text-white/50">{comment.content}</p>
                                    </div>

                                    <div className='flex gap-4 mt-1'>
                                        <span className="text-sm ml-8 dark:text-white/50 text-black/50 underline">Like</span>
                                        <span className="text-sm dark:text-white/50 text-black/50 underline">reply</span>
                                    </div>
                                </div>
                            ))
                        ) : null
                    }
            </div>
            {
                totalComments > 10 && !loading && <div className='flex justify-around'>
                    <span className='my-2 dark:text-white/50 text-black/50 text-sm' onClick={() => setPage(page + 1)}>Load more comments</span>
                </div>
            }
            {
                loading && <div className='flex flex-col justify-center items-center dark:text-white/50 text-black/50 text-xs'>
                        <Loader className='w-5 h-5 animate-spin'/>
                        <span>Loading comments</span>
                    </div>
            }
            {
                !loading && comments.length === 0 && <EmptyState message='No comments found' description='Be the first one to comment'/>
            }
        </div>
    )
}
