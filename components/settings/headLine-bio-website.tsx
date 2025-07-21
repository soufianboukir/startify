import React from 'react'
import { Button } from '../ui/button'
import { Session } from 'next-auth'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'

export const OtherDetails = ({ session }: { session: Session }) => {
    const copyToClipboard = () => {
        navigator.clipboard.writeText(session.user.headLine!)
        toast.success('Copied to clipboard')
    }
    return (
        <div className='bg-muted/20 rounded-md pt-4 border'>
            <div className='flex justify-between items-center px-5 md:px-10'>
                <div className="w-full relative">
                    <h1 className='text-2xl font-semibold mb-3'>Other details</h1>
                    <p className='text-sm mb-3'>
                    This is your URL namespace within Startify.
                    </p>

                    <div className="flex flex-col gap-4 rounded-md overflow-hidden w-[100%]">
                        <Input type='text' value={session.user.website!} placeholder='www.yourwesbite.com' />
                        <Input type='text' value={session.user.headLine!} placeholder='eg., Developer & co-founder'/>
                        <Textarea className='w-[100%]' placeholder='long description about you..'/>

                        <div className='flex flex-col items-start justify-start gap-1 w-full md:w-[40%]'>
                            <span className='dark:text-white/50 text-black/50 text-sm text-left'>
                                User ID used when interacting with the Vercel API.
                            </span>

                            <div className='relative w-full'>
                                <Input
                                    type='text'
                                    readOnly
                                    onChange={() => {}}
                                    defaultValue={"82934j23iu89535"}
                                    className='pr-10 cursor-pointer'
                                />
                                <button
                                    onClick={copyToClipboard}
                                    type='button'
                                    className='absolute right-2 top-1/2 -translate-y-1/2 dark:text-white/50 text-black/50 hover:text-black/40 dark:hover:text-white/40 cursor-pointer transition'
                                >
                                    <Copy className='w-4 h-4' />
                                </button>
                            </div>
                        </div>
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