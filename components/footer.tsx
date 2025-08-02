'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { api } from '@/config/api'
import { Loader } from 'lucide-react'

export const Footer = () => {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [status, setStatus] = useState<null | 'success' | 'error'>(null)
    const [loading,setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if(email === '' || message === '') return 
        setLoading(true)
        try{
            setStatus(null)
            const res = await api.post(`/contact`,{email, message})
    
            if (res.status === 200) {
                setStatus('success')
                setEmail('')
                setMessage('')
            } else {
                setStatus('error')
            }
        }catch{
            setStatus('error')
        }finally{
            setLoading(false)
        }
    }
    return (
        <footer className=" pt-12 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                <h2 className="text-2xl font-bold">Startify</h2>
                <p className="mt-4 text-sm text-gray-400">
                    Share your startup, SaaS, and business ideas, get real feedback, and connect with collaborators.
                </p>
                </div>

                <div>
                <h3 className="text-lg font-semibold mb-3">Explore</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                    <li><Link href="/feed" className="hover:">Browse Ideas</Link></li>
                    <li><Link href="/settings" className="hover:">Settings</Link></li>
                    <li><Link href="/saved" className="hover:">Saved items</Link></li>
                    <li><Link href="/notifications" className="hover:">Notifications</Link></li>
                </ul>
                </div>

                <div>
                <h3 className="text-lg font-semibold mb-3">About</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                    <li><Link href="https://soufianboukir.com" className="">Developer</Link></li>
                    <li><Link href="/support" className="hover:">Support</Link></li>
                    <li><Link href="/terms-of-service" className="hover:">Terms of Service</Link></li>
                    <li><Link href="/privacy-policy" className="hover:">Privacy Policy</Link></li>
                </ul>
                </div>

                <div>
                <h3 className="text-lg font-semibold mb-3">Stay Connected</h3>
                <form className="flex flex-col space-y-3" onSubmit={handleSubmit}>
                    <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    required
                    />
                    <Textarea placeholder='Your message' required value={message} onChange={(e) => setMessage(e.target.value)}/>
                    <Button disabled={loading} className='cursor-pointer'>
                        {
                            loading ? <><Loader className='animate-spin'/> Sending</> : "Contact"
                        }
                    </Button>
                    {status === 'success' && <p className="text-green-600 text-sm">Message sent! thank you</p>}
                    {status === 'error' && <p className="text-red-500 text-sm">Failed to send message.</p>}
                </form>
                </div>
            </div>

            <div className="mt-10 border-t dark:border-muted py-8 text-sm dark:text-white/80 text-black/80 text-center">
                &copy; {new Date().getFullYear()} Startify. All rights reserved.
            </div>
        </footer>
    )
}
