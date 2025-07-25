import { Comment } from '@/interfaces/comment'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { formatDistanceToNow } from 'date-fns'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { Loader } from 'lucide-react'

type CommentItemProps = {
    comment: Comment
    replying: boolean
    replyingTo: {username?: string, commentId: string},
    setReplyingTo: (value: { username?: string; commentId: string }) => void;
    disableReply: boolean
    replyToComment: () => void
    replyComment: string
    setReplyComment: (replyComment: string) => void
    isReply?: boolean
}

export const CommentItem = ({ comment, replying, replyingTo, setReplyingTo, disableReply, replyComment, setReplyComment, replyToComment, isReply }: CommentItemProps) => {
    return (
        <div className={`${isReply && 'ml-5'}`}>
            <div className="flex gap-2 items-center">
                <Avatar className="cursor-pointer w-6 h-6">
                    <AvatarImage src={comment?.author?.image} />
                    <AvatarFallback>{comment?.author?.name?.charAt(0)}</AvatarFallback>
                </Avatar>

                <span className="hover:underline duration-100 font-semibold text-sm">{comment?.author?.username}</span>

                <span className="dark:text-white/50 text-black/50 text-[12px]">
                    {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                </span>
            </div>
            <div className="mt-1 ml-8">
                <p className="text-xs dark:text-white/50">{comment.content}</p>
            </div>

            <div className='md:flex md:flex-row flex-col gap-4 mt-1'>
                <div className='flex gap-2'>
                    <span className="text-sm ml-8 dark:text-white/50 text-black/50 underline">Like</span>
                    <span className="text-sm dark:text-white/50 text-black/50 underline" onClick={() => setReplyingTo({username:comment?.author?.username, commentId: comment._id!})}>reply</span>
                </div>
                {
                    replyingTo.commentId === comment._id && 
                        <div className="flex gap-2 w-[100%] items-end md:mt-0 mt-3">
                            <Textarea placeholder={`replying to ${replyingTo.username}'s comment`} className='border-none bg-muted resize-none' value={replyComment} onChange={(e) => setReplyComment(e.target.value)}/>
                            <Button className="bg-blue-600 hover:bg-blue-700 rounded-full text-white cursor-pointer" disabled={replying || disableReply} onClick={replyToComment}>
                                {
                                    replying ?
                                        <><Loader className='animate-spin'/> replying</>
                                    : "Reply"
                                }
                            </Button>
                        </div>
                }
            </div>
        </div>
    )
}
