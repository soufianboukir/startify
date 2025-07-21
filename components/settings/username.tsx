import React from 'react'
import { Button } from '../ui/button'
import { Session } from 'next-auth'
import { Input } from '../ui/input'

export const ModifyUsername = ({ session }: { session: Session }) => {
    return (
        <div className='bg-muted/20 rounded-md pt-4 border'>
            <div className='flex justify-between items-center px-5 md:px-10'>
                <div className="w-full relative">
                    <h1 className='text-2xl font-semibold mb-3'>Username</h1>
                    <p className='text-sm mb-3'>
                    This is your URL namespace within Startify.
                    </p>

                    <div className="flex items-center border rounded-md overflow-hidden w-[100%] md:w-[40%]">
                        <span className="dark:text-white/50 px-3 text-sm select-none border-r">
                            startify.vercel.three.app.com/
                        </span>
                        <Input
                            type="text"
                            value={session.user.username!}
                            className="flex-1 px-3 py-2 bg-white text-sm focus:outline-none rounded-bl-none rounded-tl-none"
                            placeholder="Enter your username"
                        />
                    </div>
                </div>
            </div>

            <div className='border-t mt-2 md:px-10 px-5 flex justify-between py-3 items-center'>
                <p className='text-sm dark:text-white/50 text-black/50'>Please use 48 characters at maximum.</p>
                <Button>
                    Save
                </Button>
            </div>
        </div>
    )
}