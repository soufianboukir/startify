import { FeedIdeas } from '@/components/feed-ideas'
import { SuggestedUsers } from '@/components/suggested-users'
import React from 'react'

export const metadata = {
    title: "Home | Startify",
    description: "Explore trending ideas from people you follow and the most upvoted posts on Startify. Discover, collaborate, and innovate.",
    openGraph: {
        title: "Home | Startify",
        description: "Discover the top ideas and follow creative minds on Startify.",
        url: process.env.NEXT_PUBLIC_APP_URL,
        siteName: "Startify",
    },
    twitter: {
        card: "summary_large_image",
        title: "Home | IdeaHub",
        description: "Explore top ideas from the community. Follow, upvote, and collaborate.",
        images: ["https://yourdomain.com/og-image.png"],
    },
    keywords: [
        "ideas", "innovation", "startup", "collaboration", "feed", "creative projects", "social platform for ideas", "Startify"
    ],
    robots: {
        index: true,
        follow: true,
    },
}

  
const page = () => {
    return (
        <div className="md:px-16 px-2 flex gap-6 items-start">
            <div className="w-full md:w-[75%]">
                <FeedIdeas />
            </div>
            <div className="hidden md:block w-[23%]">
                <div className="fixed right-16 top-20 w-[23%] max-w-xs">
                    <SuggestedUsers />
                </div>
            </div>
        </div>
    )
}


export default page