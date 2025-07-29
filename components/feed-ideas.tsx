'use client'

import React, { useEffect, useState } from 'react'
import { api } from '@/config/api'
import { Loader } from 'lucide-react'
import { EmptyState } from './empty-state'
import { Idea } from '@/interfaces/idea'
import { IdeaCard } from './idea-card'

export const FeedIdeas = () => {

    const [ideas,setIdeas] = useState<Idea[]>([])
    const [loading,setLoading] = useState(true)
    const [page,setPage] = useState(1)
    const [totalPages,setTotalPages] = useState(0)
    const [totalIdeas,setTotalIdeas] = useState(0)
    const [moreLoading,setMoreLoading] = useState(false)

    
    useEffect(() => {
        const getIdeas = async () => {
            try {
                setLoading(true)
                const res = await api.get(`/feed`)
                if (res.status === 200) {
                    setTotalPages(res.data.totalPages)
                    setIdeas(res.data.ideas)
                    setTotalIdeas(res.data.totalIdeas)
                }
            } catch {
                // setError("An error occurred")
            } finally {
                setLoading(false)
            }
        }
    
        getIdeas()
    }, [])

    useEffect(() =>{
        const getMore = async () =>{
            if( page === 1) return 
            setMoreLoading(true)
            const res = await api.get(`/feed?page=${page}`)
            if(res.status === 200){
                const newIdeas = res.data.ideas
                setIdeas(prev =>
                    page === 1 ? newIdeas : [...prev, ...ideas]
                )
            }
            setMoreLoading(false)
        }
        getMore()
    },[page])


    return (
        <div>
            


            {
                ideas && !loading && ideas.length ?
                    ideas.map((idea) => (
                        <IdeaCard key={idea._id} idea={idea} isCurrentUser={false}/>
                    ))
                :null
            }
            {
                moreLoading && <div className='flex justify-around'>
                    <span className='my-2 dark:text-white/50 text-black/50 text-sm'>Loading...</span>
                </div>
            }
            {
                loading && <div className='flex flex-col justify-center items-center dark:text-white/50 text-black/50 text-xs'>
                        <Loader className='w-5 h-5 animate-spin'/>
                        <span>Loading ideas</span>
                    </div>
            }
            {
                !loading && ideas.length === 0 && <EmptyState message='No posts found' description='Posts will be appear here if founded'/>
            }
            {
                totalIdeas > 3 && !loading && !moreLoading && ideas.length <= totalIdeas && <div className='flex justify-around'>
                    <span className='my-2 dark:text-white/50 text-black/50 text-sm cursor-pointer' onClick={() => setPage(page + 1)}>Load more ideas</span>
                </div>
            }
        </div>
    )
}
