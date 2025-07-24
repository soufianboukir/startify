import { EmptyState } from '@/components/empty-state'
import { IdeaMenu } from '@/components/idea-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { dbConnection } from '@/config/db'
import { Idea as IIdea } from '@/interfaces/idea'
import { authOptions } from '@/lib/auth'
import Idea from '@/models/idea'
import User from '@/models/user'
import { ArrowDown, ArrowUp, Cake, MessageCircle, SquareArrowUpRight } from 'lucide-react'
import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
    await dbConnection()
    const { username } = await params
    const user = await User.findOne({ username })
  
    if (!user) {
        return {
            title: "User Not Found",
            description: `No user with username "${username}" exists.`,
        }
    }
  
    const ideasCount = await Idea.countDocuments({ author: user._id })
  
    return {
        title: `${user.username} (${user.name}) - Ideas (${ideasCount})`,
        description: `Explore ${user.name}'s startup ideas. Total ideas shared: ${ideasCount}.`,
        openGraph: {
            title: `${user.name} (@${user.username}) - Ideas (${ideasCount})`,
            description: `Explore ${user.name}'s SaaS startup ideas.`,
            url: `${process.env.NEXT_PUBLIC_APP_URL}/${user.username}`,
            siteName: "Startify Platform",
            locale: "en-US",
            type: "profile",
        },
        twitter: {
            card: "summary_large_image",
            title: `${user.name} (@${user.username})`,
            description: `Discover startup ideas shared by ${user.name}.`,
        },
    }
}

export default async function Page({ params }: { params: Promise<{ username: string }> }) {

    const { username } = await params
    const session = await getServerSession(authOptions)
    await dbConnection()
    const user = await User.findOne({ username })
    const ideas = await Idea.find({author: user._id}).populate('author', 'name username image').sort({createdAt: -1})   
    
    if(!user){
        return notFound();
    }
    return (
        <div className='pt-20 lg:w-[70%] md:w-[80%] mx-auto w-[95%]'>
            <div className='dark:bg-muted/40 rounded-md h-26 w-[100%] bg-gray-100'>
                <div className='flex justify-center'>
                    <Avatar className="cursor-pointer w-26 mt-4 h-26">
                        <AvatarImage src={user.image} />
                        <AvatarFallback>{session?.user.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                </div>
            </div>

            <div className='text-center mt-16'>
                <div>
                    <h1 className='text-4xl font-semibold mb-4'>{user.name}</h1>
                    <p className='text-xl font-semibold mb-4'>{user.headLine || "No headline setted yet"}</p>
                    <p className='md:w-[70%] w-[90%] mx-auto mb-4'>
                        {
                            user.bio ? user.bio
                            : "User has no bio yet"
                        }
                    </p>
                    <div className='md:flex block gap-8 justify-center'>
                        <p className='font-semibold items-center justify-center flex gap-2 mb-3 md:mb-0'>
                            <Cake /> <span>Joined on 13-07-2024</span>
                        </p>
                        {
                            user.website && 
                                <p className='font-semibold items-center justify-center flex gap-2 hover:text-blue-500 duration-100'>
                                    <SquareArrowUpRight /> <Link href={user.website} target='_blank'>{user.website}</Link>
                                </p>
                        }
                    </div>

                    {ideas.length === 0 ? (
                        <EmptyState
                            message="No posts found"
                            description="Your posts will appear here. Just start posting."
                        />
                        ) : (
                            <div className='flex flex-col gap-3 mt-4'>
                                {
                                    ideas.map((idea: IIdea) => (
                                        <>
                                            <div key={idea._id} className='w-[100%] cursor-pointer md:w-[80%] mx-auto text-left hover:bg-muted/10 duration-200 py-3 rounded-md px-3'>
                                                <div className='flex justify-between'>
                                                    <div className='flex gap-2 items-center'>
                                                        <Avatar className="cursor-pointer w-8 h-8">
                                                            <AvatarImage src={user.image} />
                                                            <AvatarFallback>{session?.user.name?.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <div className='flex flex-col'>
                                                            <Link className='font-medium text-zinc-900 dark:text-zinc-50 duration-100' href={`/${idea.author.username}`}>{idea.author.name}</Link>
                                                            <span className='text-xs text-zinc-500 dark:text-zinc-400'>@{idea.author.username}</span>
                                                        </div>
                                                    </div>
            
                                                    <div className='flex gap-2 items-center'>
                                                        <Badge variant="secondary">{idea.category}</Badge>
                                                        <IdeaMenu />
                                                    </div>
                                                </div>
            
                                                <div className='mt-3'>
                                                    <p className='text-lg font-semibold mb-1 hover:underline duration-200 cursor-pointer'>
                                                        {idea.title}
                                                    </p>

                                                    <span className="text-sm text-black/60 dark:text-white/70 line-clamp-5 block mb-1">
                                                        {idea.description}
                                                    </span>

                                                    {
                                                        idea.isOpenToCollab? 
                                                        <Badge className='bg-green-700 text-white'>Open to collaborators</Badge>
                                                        : <Badge className='bg-red-700 text-white'>Not open to collaborators</Badge>
                                                    }

                                                    <span className="text-sm text-red-500 dark:text-red-400 italic line-clamp-2 mt-2">
                                                        Problem: {idea.problem}
                                                    </span>
                                                </div>

                                                <div className='mt-3 flex justify-between items-center'>
                                                    <div className='flex gap-3'>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <div className='dark:bg-muted/90 bg-gray-100 flex gap-1 rounded-full px-2 py-1 dark:text-white text-black items-center'>
                                                                    <ArrowUp className='stroke-[3] duration-200 hover:bg-blue-800 rounded-full p-1 hover:text-white'/>
                                                                    <span className='text-xs font-semibold'>20</span>
                                                                    <ArrowDown className='stroke-[3] duration-200 hover:bg-orange-800 rounded-full p-1 hover:text-white'/>
                                                                </div>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Upvote if you find this idea valuable. Downvote if you think it{"'"}s not helpful.</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                        <div className='dark:bg-muted/90 bg-gray-100 flex gap-1 rounded-full px-3 py-1 dark:text-white text-black items-center duration-200 dark:hover:bg-muted/60 hover:bg-gray-200'>
                                                            <MessageCircle className='w-4 h-4'/>
                                                            <span className='text-xs font-semibold'>20</span>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <span className='text-xs text-black/70 dark:text-white/70'>Posted 20 minutes ago</span>
                                                    </div>

                                                    
                                                </div>
                                            </div>
                                            <hr className='w-[100%] md:w-[80%] mx-auto'/>
                                        </>
                                    ))
                                }
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

