import { SearchInput } from '@/components/search-input'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export const Navbar = () => {
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
                <Link href={'/help'}>Getting started</Link>
                <Link href={'/help'}>Components</Link>
                <Link href={'/help'}>Documentation</Link>
            </div>

            <div className='flex items-center gap-2'>
                <SearchInput />
                <ThemeToggle />
                <Button variant={'outline'}>Sign in</Button>
                <Button variant={'default'}>Get started</Button>
            </div>
        </div>
    )
}
