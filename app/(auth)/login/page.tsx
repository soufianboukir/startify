import { LoginForm } from '@/components/login-form'
import React, { Suspense } from 'react'

const page = () => {
    return (
        <div className='bg-muted flex min-h-svh items-center justify-center gap-6 p-6 md:p-10'>
            <Suspense>
                <LoginForm />
            </Suspense>
        </div>
    )
}


export default page;