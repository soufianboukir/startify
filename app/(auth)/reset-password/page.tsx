import ResetPasswordForm from '@/components/reset-password-form';
import React from 'react'

const page = () => {
    return (
        <div className='bg-muted flex min-h-svh items-center justify-center gap-6 p-6 md:p-10'>
            <ResetPasswordForm />
        </div>
    )
}


export default page;