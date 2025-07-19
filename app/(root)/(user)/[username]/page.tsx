import { EmptyState } from '@/components/empty-state'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { dbConnection } from '@/config/db'
import { authOptions } from '@/lib/auth'
import User from '@/models/user'
import { Cake, SquareArrowUpRight } from 'lucide-react'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'


export default async function Page({ params }: { params: Promise<{ username: string }> }) {

    const { username } = await params
    const session = await getServerSession(authOptions)
    await dbConnection()
    const user = await User.findOne({ username})
    const isCurrentUser = session?.user.username === username


    if(!user){
        return notFound();
    }
    return (
        <div className='pt-20 lg:w-[70%] md:w-[80%] mx-auto w-[95%]'>
            <div className='dark:bg-muted/40 rounded-md h-26 w-[100%] bg-gray-100'>
                <span>{isCurrentUser && "It the current user"}</span>
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
                    <p className='text-xl font-semibold mb-4'>{user.headLine || "Next.js developer"}</p>
                    <p className='md:w-[70%] w-[90%] mx-auto mb-4'>
                        Hi there. i{"'"}m soufian,

                        I enjoy turning ideas into fast, simple, and useful experiences.

                        Here you{"'"}ll find fragments of my curiosity, experiments, and ambition, written in code, shaped by open source, and shared with intention.

                        Available for open-source projects using MERN stack, Next.js, happy to collaborate!
                    </p>
                    <div className='flex gap-8 justify-center'>
                        <p className='font-semibold items-center justify-center flex gap-2'>
                            <Cake /> <span>Joined on 13-07-2024</span>
                        </p>
                        {
                            // user.website && 
                                <p className='font-semibold items-center flex gap-2 hover:text-blue-500 duration-100'>
                                    <SquareArrowUpRight /> <Link href={'/'} target='_blank'>soufianboukir.com</Link>
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

