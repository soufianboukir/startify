import { EmptyState } from '@/components/empty-state'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { dbConnection } from '@/config/db'
import { authOptions } from '@/lib/auth'
import Idea from '@/models/idea'
import User from '@/models/user'
import { Cake, SquareArrowUpRight } from 'lucide-react'
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
    const user = await User.findOne({ username})
    // const ideas = await Idea.find({author: user._id}).populate('author', 'name username image')    

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
                    <div className='flex gap-8 justify-center'>
                        <p className='font-semibold items-center justify-center flex gap-2'>
                            <Cake /> <span>Joined on 13-07-2024</span>
                        </p>
                        {
                            user.website && 
                                <p className='font-semibold items-center flex gap-2 hover:text-blue-500 duration-100'>
                                    <SquareArrowUpRight /> <Link href={user.website} target='_blank'>{user.website}</Link>
                                </p>
                        }
                    </div>

                    <div>
                        <EmptyState message='No posts found' description='Your posts will be appeared here. just start posting'/>
                    </div>
                </div>
            </div>
        </div>
    )
}

