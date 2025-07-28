"use client"


import { ProfileMenu } from '@/components/dropdown-menu'
import { IdeaForm } from '@/components/idea-form'
import { Notifications } from '@/components/notifications'
import { SearchInput } from '@/components/search-input'
import { ThemeToggle } from '@/components/theme-toggle'
import { Mail } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Layout = () => {
    const { data: session, status } = useSession()
    if(status === 'loading') return null

    return (
        <div className='fixed py-3 items-center border border-b dark:border-muted/60 border-b-gray-200 w-[100%] md:px-16 px-6 flex justify-between z-10 bg-white dark:bg-background'>
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
                <Notifications />
                <IdeaForm />
                {
                    session && <ProfileMenu session={session}/>
                }
                <ThemeToggle />
            </div>
        </div>
    )
}

const Footer = () =>{
    return (
        <div className='bg-background py-8 w-full border-t border-gray-200 dark:border-muted/90'>
            <div className='flex md:flex-row gap-10 md:gap-0 flex-col justify-between dark:text-white/50 text-black/50 text-sm md:w-[80%] lg:w-[70%] mx-auto w-[90%] items-center'>
                <div className='flex flex-col md:flex-row items-center gap-3'>
                    <Image src={'/icons/startify-logo.png'} width={25} height={25} alt='startify-logo'/>
                    <Link href={'/'} className='dark:hover:text-white duration-200 hover:text-black'>Home</Link>
                    <Link href={'/'} className='dark:hover:text-white duration-200 hover:text-black'>Docs</Link>
                    <Link href={'/'} className='dark:hover:text-white duration-200 hover:text-black'>Developer</Link>
                    <Link href={'/'} className='dark:hover:text-white duration-200 hover:text-black'>Privacy policy</Link>
                    <Link href={'/'} className='dark:hover:text-white duration-200 hover:text-black'>Terms of service</Link>
                    <Link href={'/'} className='dark:hover:text-white duration-200 hover:text-black'>Contact</Link>
                </div>

                <div>
                    <span>© 2025, Startify Inc.</span>
                </div>
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
            <body className="h-[100vh] flex flex-col">
                <Layout />
                    <main className="flex-1">
                        {children}
                    </main>
                <Footer />
            </body>
        </html>
    );
}
  
