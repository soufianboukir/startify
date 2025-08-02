"use client"


import { ProfileMenu } from '@/components/dropdown-menu'
import { IdeaForm } from '@/components/idea-form'
import { Notifications } from '@/components/notifications'
import { SearchInput } from '@/components/search-input'
import { ThemeToggle } from '@/components/theme-toggle'
import { api } from '@/config/api'
import { Mail } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export const Header = () => {
    const { data: session, status } = useSession()

    const [loading,setLoading] = React.useState(false)
    const [unseenConvs,setUnseenConvs] = React.useState(0)

    const fetchUnseenMssgs = async () =>{
        try{
        setLoading(true)
        const res = await api.get('/messages/unseen')
        if(res.status === 200){
            setUnseenConvs(res.data.unseenConversations)
        }
        }catch{
        
        }finally{
        setLoading(false)
        }
    }

    React.useEffect(() =>{
        fetchUnseenMssgs()
    },[])
    if(status === 'loading' || loading) return null

    return (
        <div className='fixed py-3 items-center border border-b dark:border-muted/60 border-b-gray-200 w-[100%] md:px-16 px-6 flex justify-between z-10 bg-white dark:bg-background'>
            <Link className='flex gap-2 items-center cursor-pointer' href={'/feed'}>
                <Image src={'/icons/startify-logo.png'} width={30} height={30} alt='Startify logo' className='rounded-xs'/>
                <div className='hidden flex-col lg:flex'>
                    <span className='font-semibold'>Startify</span>
                    <span className='text-xs'>Connecting worldwide ideas</span>
                </div>
            </Link>

            <div className='lg:w-[25%] md:w-[50%] w-[60%]'>
                <SearchInput />
            </div>

            <div className='flex gap-4 items-center'>
                <Link href={'/inbox'}>
                    <div className='relative'>
                        <Mail className="w-5 h-5 hidden md:block cursor-pointer" />
                        {
                            unseenConvs > 0 ?
                                <div>
                                    <span className="absolute -top-0.5 -right-1 w-2 h-2 bg-red-500 rounded-full md:block hidden"></span>
                                </div>
                            :null
                        }
                    </div>
                </Link>
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

export const Footer = () =>{
    return (
        <div className='bg-background py-8 w-full border-t border-gray-200 dark:border-muted/90'>
            <div className='flex md:flex-row gap-10 md:gap-0 flex-col justify-between dark:text-white/50 text-black/50 text-sm md:w-[80%] lg:w-[70%] mx-auto w-[90%] items-center'>
                <div className='flex flex-col md:flex-row items-center gap-5'>
                    <Image src={'/icons/startify-logo.png'} width={25} height={25} alt='startify-logo'/>
                    <Link href={'/'} className='dark:hover:text-white duration-200 hover:text-black'>Home</Link>
                    <Link href={'https://soufianboukir.com'} className='dark:hover:text-white duration-200 hover:text-black'>Developer</Link>
                    <Link href={'/privacy-policy'} className='dark:hover:text-white duration-200 hover:text-black'>Privacy policy</Link>
                    <Link href={'/terms-of-service'} className='dark:hover:text-white duration-200 hover:text-black'>Terms of service</Link>
                    <Link href={'/support'} className='dark:hover:text-white duration-200 hover:text-black'>Support</Link>
                </div>

                <div>
                    <span>© 2025, Startify Inc.</span>
                </div>
            </div>
        </div>  
    )
}