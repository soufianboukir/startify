import React from 'react'
import Lottie from 'lottie-react'
import LoginAnimation from '@/lotties/login-animation.json'

export const HowItWorks = () => {
    return (
        <div className='h-[100vh] lg:px-[6%] md:px-8 px-5'>
            <div className='mt-20'>
                <h1 className='text-3xl font-semibold'>How it works?</h1>
                <p className='text-lg font-medium'>Get a clear understanding of how our platform helps you validate your ideas. Whether you{"'"}re sharing a SaaS concept, product feature, or business model, this section walks you through the process—from posting your idea to gathering feedback and iterating based on real insights</p>
            </div>

            <div className='mt-10 grid-cols-3 gap-10'>
                <div className='flex flex-col gap-3'>
                    <Lottie
                    loop
                    animationData={LoginAnimation} />
                    <h1>Sign in</h1>
                    <span>To get started, simply log in to your account using your email and password. This ensures your ideas are securely linked to your profile and allows you to track feedback, interact with other users, and manage your submissions</span>
                </div>
            </div>
        </div>
    )
}
