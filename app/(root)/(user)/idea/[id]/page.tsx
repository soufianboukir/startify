import { Comments } from "@/components/comments"
import CommentsLength from "@/components/commentsLength"
import { IdeaMenu } from "@/components/idea-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Votes from "@/components/votes"
import { dbConnection } from "@/config/db"
import { authOptions } from "@/lib/auth"
import Idea from "@/models/idea"
import { formatDistanceToNow } from "date-fns"
import { Metadata } from "next"
import { getServerSession } from "next-auth"
import Link from "next/link"
import { notFound } from "next/navigation"


export async function generateMetadata({ params }: { params:Promise<{ id: string }> }): Promise<Metadata> {
    await dbConnection()

    const { id } = await params
    const idea = await Idea.findById(id).populate('author', 'name username image')

    if (!idea) {
        return {
            title: "Idea Not Found",
            description: "No idea was found with the specified ID.",
        }
    }

    const author = idea.author
    const ideasCount = await Idea.countDocuments({ author: author._id })

    return {
        title: `${idea.title} - by ${author.name}`,
        description: `${idea.description.slice(0, 150)}...`,
        openGraph: {
            title: `${idea.title} - by ${author.name}`,
            description: `Explore this startup idea by ${author.name}. Total ideas shared: ${ideasCount}.`,
            url: `${process.env.NEXT_PUBLIC_APP_URL}/idea/${id}`,
            siteName: "Startify Platform",
            locale: "en-US",
            type: "article",
        },
        twitter: {
            card: "summary_large_image",
            title: `${idea.title} - by ${author.name}`,
            description: `Discover this startup idea shared by ${author.name}.`,
        },
    }
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params
    const session = await getServerSession(authOptions)
    await dbConnection()
    const idea = await Idea.findById(id).populate('author', 'name username image')
    const isCurrentUser = session?.user.id === idea.author._id;

    if (!idea) {
        return notFound();
    }

    return (
        <div className='pt-20 lg:w-[70%] md:w-[80%] mx-auto w-[95%]'>
            <div className='flex flex-col gap-3 mt-4'>
                <div>
                    <div className='w-[100%] cursor-pointer md:w-[80%] mx-auto text-left duration-200 py-3 rounded-md px-3'>
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
                            <p className='text-lg font-semibold mb-1 cursor-pointer'>
                                {idea.title}
                            </p>

                            <p className="text-sm text-black/60 dark:text-white/70 line-clamp-5 block mb-1">
                                <div dangerouslySetInnerHTML={{ __html: idea.description.replace(/\. /g, '.<br />') }} />
                            </p>

                            {
                                idea.isOpenToCollab ?
                                    <Badge className='bg-green-700 text-white'>Open to collaborators</Badge>
                                    : <Badge className='bg-red-700 text-white'>Not open to collaborators</Badge>
                            }

                            <p className="text-sm text-red-500 dark:text-red-400 italic mt-2">
                                Problem: <div dangerouslySetInnerHTML={{ __html: idea.problem.replace(/\. /g, '.<br />') }} />
                            </p>
                        </div>

                        <div className='mt-3 flex justify-between items-center'>
                            <div className='flex gap-3'>
                                <Votes ideaId={idea._id} upVotes={idea.upVotes} downVotes={idea.downVotes}/>
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
                <div className="w-[100%] cursor-pointer md:w-[80%] mx-auto">
                    {
                        session && <Comments ideaId={id} session={session}/>
                    }
                </div>
            </div>
        </div>
    )
}

