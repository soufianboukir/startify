import { Idea } from '@/interfaces/idea'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import Link from 'next/link'
import { Badge } from './ui/badge'
import { IdeaMenu } from './idea-menu'
import Votes from './votes'
import { formatDistanceToNow } from 'date-fns'
import { CommentsLength } from './commentsLength'

export const IdeaCard = ({ idea, isCurrentUser }: { idea: Idea, isCurrentUser: boolean}) => {
    return (
        <div>
            <div className='w-[100%] md:w-[80%] mx-auto text-left hover:bg-muted/10 duration-200 py-3 rounded-md px-3'>
                <div className='flex justify-between'>
                    <div className='flex gap-2 items-center'>
                        <Avatar className="cursor-pointer w-8 h-8">
                            <AvatarImage src={idea.author.image} />
                            <AvatarFallback>{idea.author.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col'>
                            <Link className='font-medium text-zinc-900 dark:text-zinc-50 duration-100' href={`/${idea.author.username}`}>{idea.author.name}</Link>
                            <span className='text-xs text-zinc-500 dark:text-zinc-400'>@{idea.author.username}</span>
                        </div>
                    </div>

                    <div className='flex gap-2 items-center'>
                        <Badge variant="secondary">{idea.category}</Badge>
                        <IdeaMenu isCurrentUser={isCurrentUser} idea={idea} />
                    </div>
                </div>

                <div className='mt-3'>
                    <Link className='text-lg font-semibold mb-1 hover:underline duration-200 cursor-pointer' href={`/idea/${idea._id}`}>
                        {idea.title}
                    </Link>

                    <p className="text-sm text-black/60 dark:text-white/70 mb-1">
                        {idea.description}
                    </p>

                    {
                        idea.isOpenToCollab ?
                            <Badge className='bg-green-700 text-white'>Open to collaborators</Badge>
                            : <Badge className='bg-red-700 text-white'>Not open to collaborators</Badge>
                    }

                    <span className="text-sm text-red-500 dark:text-red-400 italic line-clamp-2 mt-2">
                        Problem: {idea.problem}
                    </span>
                </div>

                <div className='mt-3 flex justify-between items-center'>
                    <div className='flex gap-3'>
                        <Votes ideaId={idea._id} upVotes={idea?.upVotes} downVotes={idea.downVotes}/>
                        <CommentsLength ideaId={idea._id}/>
                    </div>

                    <div>
                        <span className='text-xs text-black/70 dark:text-white/70'>
                            {formatDistanceToNow(idea.createdAt, { addSuffix: true })}
                        </span>
                    </div>
                </div>
            </div>
            <hr className='w-[100%] md:w-[80%] mx-auto' />
        </div>
    )
}
