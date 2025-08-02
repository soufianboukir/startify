'use client'

import { Button } from '@/components/ui/button'

export default function CallToAction() {
  return (
    <section className="px-[8%] h-[100vh] flex flex-col justify-center w-[70%] mx-auto text-center gap-8">
        <h1 className="text-5xl font-semibold">
            Share your next big idea. <br /> Get feedback. Find collaborators.
        </h1>
        <p className="text-xl font-semibold">
            Discover and share SaaS, business, and startup ideas — validate them with real feedback <br /> and connect with builders ready to bring them to life.
        </p>

        <div className='flex gap-3 justify-center'>
            <Button variant={'outline'}>
                Github
            </Button>
            <Button>
                Get started
            </Button>
        </div>
    </section>
  )
}
