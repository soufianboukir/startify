'use client'

import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Comment } from '@/interfaces/comment'
import { api } from '@/config/api'
import { Loader } from 'lucide-react'
import { toast } from 'sonner'
import { EmptyState } from './empty-state'
import { Session } from 'next-auth'
import { CommentItem } from './commentItem'

export const Comments = ({ ideaId, session }: { ideaId: string, session: Session }) => {

    const [comments,setComments] = useState<Comment[]>([])
    const [loading,setLoading] = useState(true)
    const [page,setPage] = useState(1)
    const [commentInput,setCommentInput] = useState('')
    const [posting,setPosting] = useState(false)
    const [totalComments,setTotalComments] = useState(0)
    const disableBtn = commentInput === ''
    const [moreLoading,setMoreLoading] = useState(false)

    
    useEffect(() => {
        const getComments = async () => {
            try {
                setLoading(true)
                const res = await api.get(`/comments/${ideaId}`)
                if (res.status === 200) {
                    setTotalComments(res.data.total)
                    setComments(res.data.comments)
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
    }, [ideaId])

    useEffect(() =>{
        const getMore = async () =>{
            if( page === 1) return 
            setMoreLoading(true)
            const res = await api.get(`/comments/${ideaId}?page=${page}`)
            if(res.status === 200){
                const newComments = res.data.comments
                setComments(prev =>
                    page === 1 ? newComments : [...prev, ...newComments]
                )
            }
            setMoreLoading(false)
        }
        getMore()
    },[page,ideaId])


    const postComment = async () =>{
        if( commentInput === '') return
        try{
            setPosting(true)
            const res = await api.post(`/comments`,{content: commentInput, ideaId})
            if(res.status === 200){
                toast.success('Comment posted successfully')
                setCommentInput('')                
                setComments([res.data.comment,...comments])
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
                <Input type="text" placeholder="Post a comment" value={commentInput} onChange={(e) => setCommentInput(e.target.value)}/>
                <Button className="bg-blue-600 hover:bg-blue-700 rounded-full text-white cursor-pointer" disabled={posting || disableBtn} onClick={postComment}>
                    {
                        posting ?
                            <><Loader className='animate-spin'/> posting</>
                        : "Post"
                    }
                </Button>
            </div>

            <div className="mt-6 flex flex-col gap-3">
                    {comments && comments.length && !loading ? comments.map((comment) => (
                        <div key={comment._id}>
                            <CommentItem comment={comment} session={session}/>
                        </div>
                    )): null}
            </div>
            {
                totalComments > 10 && !loading && !moreLoading && comments.length <= totalComments && <div className='flex justify-around'>
                    <span className='my-2 dark:text-white/50 text-black/50 text-sm' onClick={() => setPage(page + 1)}>Load more comments</span>
                </div>
            }
            {
                moreLoading && <div className='flex justify-around'>
                    <span className='my-2 dark:text-white/50 text-black/50 text-sm'>Loading...</span>
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
