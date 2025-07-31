import { EmptyState } from '@/components/empty-state'
import { FollowButton } from '@/components/follow-btn'
import { FollowingFollowers } from '@/components/following-followers-dialog'
import { IdeaCard } from '@/components/idea-card'
import { MessageButton } from '@/components/message-btn'
import { ReportDialog } from '@/components/report-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { dbConnection } from '@/config/db'
import { Follower as FollowerInterface, Following } from '@/interfaces/follower'
import { Idea as IIdea } from '@/interfaces/idea'
import { authOptions } from '@/lib/auth'
import Follower from '@/models/follower'
import Idea from '@/models/idea'
import User from '@/models/user'
import { format } from 'date-fns'
import { Cake, SquareArrowUpRight } from 'lucide-react'
import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
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
    if (!user) {
        return notFound();
    }

    const followers = (await Follower.find({ followingUser: user._id })
            .populate('followerUser', 'name username image')
            .lean()) as FollowerInterface[];

        const following = (await Follower.find({ followerUser: user._id })
            .populate('followingUser', 'name username image')
            .lean()) as Following[];

    const isFollowing = await Follower.findOne({followerUser: session?.user.id,followingUser: user._id});

    const ideas = await Idea.find({ author: user._id }).populate('author', 'name username image').sort({ createdAt: -1 })
    const isCurrentUser = session?.user.id === user._id.toString();

    
    return (
        <div className='lg:w-[70%] md:w-[80%] mx-auto w-[95%]'>
            <div className='dark:bg-muted/40 rounded-md h-26 w-[100%] bg-gray-100'>
                <div className='flex justify-center'>
                    <Avatar className="cursor-pointer w-26 mt-8 h-26">
                        <AvatarImage src={user.image} />
                        <AvatarFallback>{session?.user.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                </div>
            </div>

            <div className='text-center mt-16'>
                <div>
                    <h1 className='text-4xl font-semibold mb-4'>{user.name}</h1>
                    <p className='text-xl font-semibold mb-4'>{user.headLine || "No headline setted yet"}</p>

                    <div className="flex items-center justify-center gap-4 mb-4 text-sm text-gray-700 dark:text-gray-300">
                        {
                            isCurrentUser && (
                                <>
                                    <FollowingFollowers type={'followers'} followers={followers}/>
                                    <div className="w-px h-4 bg-gray-400 dark:bg-gray-600"></div>
                                    <FollowingFollowers type='following' following={following}/>
                                </>
                            )
                        }
                        {
                            !isCurrentUser && (
                                <div className="flex items-center gap-4 text-lg cursor-pointer">
                                    <div className='flex gap-1 items-center'>
                                        <span className="font-semibold">{followers.length}</span>
                                        <span className='text-sm'>Followers</span>
                                    </div>
                                    <div className="w-px h-4 bg-gray-400 dark:bg-gray-600"></div>
                                    <div className='flex gap-1 items-center'>
                                        <span className="font-semibold">{following.length}</span>
                                        <span className='text-sm'>Following</span>
                                    </div>
                                </div>
                            )
                        }
                        {
                            !isCurrentUser && (
                                <FollowButton userId={user._id} isFollowing={isFollowing}/>
                            )
                        }
                        {
                            !isCurrentUser && (
                                <MessageButton username={user.username}/>
                            )
                        }
                        {
                            !isCurrentUser && (
                                <ReportDialog userId={user._id} type='User'/>
                            )
                        }
                    </div>

                    <p className='md:w-[70%] w-[90%] mx-auto mb-4'>
                        {
                            user.bio ? user.bio
                                : "User has no bio yet"
                        }
                    </p>
                    <div className='md:flex block gap-8 justify-center'>
                        <p className='font-semibold items-center justify-center flex gap-2 mb-3 md:mb-0'>
                            <Cake /> <span>Joined on {format(user.createdAt,'dd-MM-yyyy')}</span>
                        </p>
                        {
                            user.website &&
                            <p className='font-semibold items-center justify-center flex gap-2 hover:text-blue-500 duration-100'>
                                <SquareArrowUpRight /> <a href={'https://'+user.website} target='_blank'>{user.website}</a>
                            </p>
                        }
                    </div>

                    <div className='md:w-[85%] w-[100%] mx-auto'>
                        {ideas.length === 0 ? (
                            <EmptyState
                                message="No posts found"
                                description="Your posts will appear here. Just start posting."
                            />
                        ) : (
                            <div className='flex flex-col gap-3 mt-4'>
                                {
                                    ideas.map((idea: IIdea) => (
                                        <IdeaCard key={idea._id} idea={idea} isCurrentUser={isCurrentUser}/>
                                    ))
                                }
                            </div>
                        )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

