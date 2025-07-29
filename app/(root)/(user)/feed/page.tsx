import { FeedIdeas } from '@/components/feed-ideas'
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
        <div>
            <FeedIdeas />
        </div>
    )
}


export default page