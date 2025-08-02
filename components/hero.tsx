'use client'

import {
    User,
    Edit3,
    MessageCircle,
    ThumbsUp,
    Bookmark,
    Bell,
    UserPlus,
    Flag,
  } from 'lucide-react'
import { BackgroundBeams } from './ui/background-beams'
  
  export const features = [
    {
      title: 'User Profile Management',
      description: 'Set up and customize your profile with a headline, username, and profile image.',
      icon: <User />,
    },
    {
      title: 'Idea Management',
      description: 'Post new ideas, edit existing ones, and delete ideas you no longer want to share.',
      icon: <Edit3 />,
    },
    {
      title: 'Direct Real-Time Messaging',
      description: 'Chat privately with other users in real time to collaborate and connect.',
      icon: <MessageCircle />,
    },
    {
      title: 'Upvote & Like System',
      description: 'Support ideas and comments by upvoting or liking, helping the best content rise.',
      icon: <ThumbsUp />,
    },
    {
      title: 'Save & Bookmark',
      description: 'Save ideas and comments to your personal collection for quick access later.',
      icon: <Bookmark />,
    },
    {
      title: 'Real-Time Notifications',
      description: 'Receive instant updates about interactions, comments, and followers.',
      icon: <Bell />,
    },
    {
      title: 'Follow & Unfollow',
      description: 'Build your network by following users and unfollowing when needed.',
      icon: <UserPlus />,
    },
    {
      title: 'Content Reporting',
      description: 'Report inappropriate or irrelevant ideas and comments to maintain a safe community.',
      icon: <Flag />,
    },
  ]
  

export default function Hero() {

  return (
        <div id='getting-started'>
            <div className="relative isolate px-6 lg:px-8">
                <div
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 flex items-center justify-center overflow-hidden"
                    >
                <div
                    className="w-[60rem] h-[60rem] rounded-full bg-gradient-to-tr from-[#ffffff] to-[#9f9f9f] dark:from-[#02001d] dark:to-[#484848]
                            blur-3xl opacity-30"
                />
                </div>

                <BackgroundBeams />
                <div className="fixed bottom-4 left-4 px-4 py-2 bg-white dark:bg-zinc-900 border border-blue-500 shadow-lg animate-fade-in font-semibold rounded-full">
                  <a className="text-sm text-gray-700 dark:text-gray-300" href='https://soufianboukir.com' target='_blank'>
                    Built with ❤️ by <span className="text-blue-600 font-semibold">Soufian</span>
                  </a>
                </div>

                <div className="mx-auto max-w-6xl lg:py-40 py-30 dark:text-white">
                    <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                        <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-600 ring-1 ring-gray-900/10 dark:ring-gray-600 hover:ring-gray-900/20 dark:text-white">
                        Announcing our next round of funding.{' '}
                        <a href="#" className="font-semibold text-indigo-600">
                            <span aria-hidden="true" className="absolute inset-0" />
                            Read more <span aria-hidden="true">&rarr;</span>
                        </a>
                        </div>
                    </div>
                    <div className="text-center">
                        <h1 className="md:text-6xl text-4xl font-semibold tracking-tight text-balance text-gray-900 dark:text-white">
                            Everything You Need <br /> Build, Share, and Connect
                        </h1>
                        <p className="mt-8 text-gray-500 text-sm md:text-lg dark:text-white">
                            Startify enables you to share your innovative ideas, receive constructive feedback from a vibrant community, and collaborate with like-minded creators. Whether you{"'"}re posting new concepts, managing your profile, or connecting through real-time messaging, everything you need to turn your vision into reality is here — all in one accessible, easy-to-use space.
                        </p>

                    </div>

                    <div className="grid lg:grid-cols-4 w-[100%] mt-14 gap-6 md:grid-cols-3 sm:grid-cols-2">
                        {
                            features.map((feat) => (
                                <div key={feat.title}>
                                    <p className="flex gap-2 items-start">{feat.icon} <span className="font-medium">{feat.title}</span></p>
                                    <p className="dark:text-white/90 text-black/90 text-sm mt-2">{feat.description}</p>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
  )
}