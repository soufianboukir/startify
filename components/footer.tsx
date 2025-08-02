import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'

export const Footer = () => {
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
                    <li><Link href="/ideas" className="hover:text-white">Browse Ideas</Link></li>
                    <li><Link href="/submit" className="hover:text-white">Submit Idea</Link></li>
                    <li><Link href="/feedback" className="hover:text-white">Get Feedback</Link></li>
                    <li><Link href="/collaborators" className="hover:text-white">Find Collaborators</Link></li>
                </ul>
                </div>

                <div>
                <h3 className="text-lg font-semibold mb-3">About</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                    <li><Link href="https://soufianboukir.com" className="hover:text-white">Developer</Link></li>
                    <li><Link href="/support" className="hover:text-white">Support</Link></li>
                    <li><Link href="/terms-of-service" className="hover:text-white">Terms of Service</Link></li>
                    <li><Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
                </ul>
                </div>

                <div>
                <h3 className="text-lg font-semibold mb-3">Stay Connected</h3>
                <form className="flex flex-col space-y-3">
                    <Input
                    type="email"
                    placeholder="Your email"
                    />
                    <Button>Contact</Button>
                </form>
                </div>
            </div>

            <div className="mt-10 border-t dark:border-muted py-8 text-sm text-gray-500 text-center">
                &copy; {new Date().getFullYear()} Startify. All rights reserved.
            </div>
        </footer>
    )
}
