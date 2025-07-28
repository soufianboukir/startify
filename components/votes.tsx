'use client'

import React, { useState, useEffect } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { ArrowDown, ArrowUp, Loader } from 'lucide-react'
import { api } from '@/config/api'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'

const Votes = ({
  ideaId,
  upVotes,
  downVotes,
}: {
  ideaId: string
  upVotes: string[]
  downVotes: string[]
}) => {
    const { data: session, status } = useSession()
    const userId = session?.user?.id
    const [upVoting, setUpVoting] = useState(false)
    const [downVoting, setDownVoting] = useState(false)

    const [userUpvoted, setUserUpvoted] = useState(false)
    const [userDownvoted, setUserDownvoted] = useState(false)

    const [upVoteCount, setUpVoteCount] = useState(upVotes.length)
    const [downVoteCount, setDownVoteCount] = useState(downVotes.length)

    useEffect(() => {
        if (userId) {
        setUserUpvoted(upVotes.includes(userId))
        setUserDownvoted(downVotes.includes(userId))
        }
    }, [upVotes, downVotes, userId])

    if (status === 'loading') return null

    const toggleVote = async (type: 'upvote' | 'downvote') => {
        if (!userId) {
            toast.error('You must be logged in to vote.')
            return
        }

        if (type === 'upvote') setUpVoting(true)
        else setDownVoting(true)

        try {
            const res = await api.patch(`/ideas/${ideaId}/vote`, { type })

        if (res.status === 200) {
            toast.success(res.data.message)

            if (type === 'upvote') {
                if (userUpvoted) {
                    setUserUpvoted(false)
                    setUpVoteCount((prev) => prev - 1)
                } else {
                    setUserUpvoted(true)
                    setUpVoteCount((prev) => prev + 1)
                    if (userDownvoted) {
                    setUserDownvoted(false)
                    setDownVoteCount((prev) => prev - 1)
                    }
                }
            } else if (type === 'downvote') {
            if (userDownvoted) {
                    setUserDownvoted(false)
                    setDownVoteCount((prev) => prev - 1)
                } else {
                    setUserDownvoted(true)
                    setDownVoteCount((prev) => prev + 1)
                    if (userUpvoted) {
                    setUserUpvoted(false)
                    setUpVoteCount((prev) => prev - 1)
                    }
                }
            }
        }
        } catch {
            toast.error('An error occurred while voting.')
        } finally {
            if (type === 'upvote') setUpVoting(false)
            else setDownVoting(false)
        }
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div className="dark:bg-muted/90 bg-gray-100 flex gap-1 rounded-full px-2 py-1 dark:text-white text-black items-center">
                {upVoting ? (
                    <Loader className="stroke-[3] animate-spin bg-blue-800 rounded-full p-1 text-white" />
                ) : (
                    <ArrowUp
                    className={`stroke-[3] cursor-pointer hover:bg-blue-800 rounded-full p-1 hover:text-white ${
                        userUpvoted ? 'bg-blue-600 text-white' : ''
                    }`}
                    onClick={() => toggleVote('upvote')}
                    />
                )}
                <span className="text-xs font-semibold">{upVoteCount - downVoteCount}</span>
                {downVoting ? (
                    <Loader className="stroke-[3] animate-spin bg-orange-800 rounded-full p-1 text-white" />
                ) : (
                    <ArrowDown
                    className={`stroke-[3] cursor-pointer hover:bg-orange-800 rounded-full p-1 hover:text-white ${
                        userDownvoted ? 'bg-orange-600 text-white' : ''
                    }`}
                    onClick={() => toggleVote('downvote')}
                    />
                )}
                </div>
            </TooltipTrigger>
            <TooltipContent>
                <p>Upvote if this idea is valuable. Downvote if not helpful.</p>
            </TooltipContent>
        </Tooltip>
    )
}

export default Votes
