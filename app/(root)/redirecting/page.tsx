'use client'

import { Loader } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React from 'react'

const Redirecting = () => {
    const { data:session,status } = useSession();
    const router = useRouter()
    
    if (status === 'loading') {
        return <div className='bg-muted min-h-svh items-center justify-center gap-6 p-6 md:p-10 flex'>
            <Loader className='w-8 h-8 animate-spin'/>
        </div>
    }

    if(status === 'authenticated' && session.user.role === 'user'){
        router.push('/user/discovery')
    }

    if(status === 'authenticated' && session.user.role === 'admin'){
        router.push('/dashboard')
    }

    if(status === 'unauthenticated'){
        router.push('/login')
    }
}

export default Redirecting
