"use client"


import { ProfileMenu } from '@/components/dropdown-menu'
import { SearchInput } from '@/components/search-input'
import { ThemeToggle } from '@/components/theme-toggle'
import { Bell, Mail, PlusSquare } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import React from 'react'

const Layout = () => {
    const { data: session, status } = useSession()
    if(status === 'loading') return null

    return (
        <div className='fixed py-3 items-center border border-b dark:border-muted/60 border-b-gray-200 w-[100%] md:px-16 px-6 flex justify-between z-10 bg-white dark:bg-muted/10'>
            <div className='flex gap-2 items-center cursor-pointer'>
                <Image src={'/icons/startify-logo.png'} width={30} height={30} alt='Startify logo' className='rounded-xs'/>
                <div className='hidden flex-col md:flex'>
                    <span className='font-semibold'>Startify</span>
                    <span className='text-xs'>Connecting worldwide ideas</span>
                </div>
            </div>

            <div className='lg:w-[25%] md:w-[50%] w-[60%]'>
                <SearchInput />
            </div>

            <div className='flex gap-4 items-center'>
                <Mail className='w-5 h-5 hidden md:block'/>
                <Bell className='w-5 h-5 hidden md:block'/>
                <PlusSquare className='w-5 h-5 hidden md:block'/>
                {
                    session && <ProfileMenu session={session}/>
                }
                <ThemeToggle />
            </div>
        </div>
    )
}

export default function RootLayout({
        children,
    }: Readonly<{
        children: React.ReactNode;
    }>) {
        return (
        <html lang="en">
            <body
            >
                <Layout />
                {children}
            </body>
        </html>
    );
}
  
