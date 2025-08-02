'use client'

import { SearchInput } from '@/components/search-input'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Session } from 'next-auth'
import Image from 'next/image'
import React from 'react'
import { ProfileMenu } from './dropdown-menu'
import { Link as ScrollLink } from 'react-scroll';
import Link from 'next/link'

export const Navbar = ({ session }: { session?: Session}) => {
    return (
        <div className="flex justify-between fixed w-full z-20 bg-transparent backdrop-blur-2xl py-6 lg:px-[6%] md:px-8 px-5 items-center">
            <div>
                <Link className='flex gap-2 items-center cursor-pointer' href={'/feed'}>
                    <Image src={'/icons/startify-logo.png'} width={30} height={30} alt='Startify logo' className='rounded-xs'/>
                    <div className='hidden flex-col lg:flex'>
                        <span className='font-semibold'>Startify</span>
                        <span className='text-xs'>Connecting worldwide ideas</span>
                    </div>
                </Link>
            </div>

            <div className='flex gap-5 items-center text-sm font-medium'>
                <ScrollLink to='getting-started' smooth duration={500} className='cursor-pointer'>Getting started</ScrollLink>
                <ScrollLink to='how-it-works' smooth duration={500} className='cursor-pointer'>How it works</ScrollLink>
                <ScrollLink to='faqs' smooth duration={500} className='cursor-pointer'>FAQs</ScrollLink>
                <ScrollLink to='what-people-say' smooth duration={500} className='cursor-pointer'>Testimonials</ScrollLink>
            </div>

            <div className='flex items-center gap-2'>
                <SearchInput />
                <ThemeToggle />
                {
                    session ? 
                        <ProfileMenu session={session}/>
                    : <>
                        <Button variant={'outline'}>
                            <Link href={'/login'}>Sign in</Link>
                        </Button>
                        <Button variant={'default'}>
                            <Link href={'/feed'}>Get started</Link>
                        </Button>
                    </>
                }
            </div>
        </div>
    )
}
