'use client'

import React, { useEffect, useState } from 'react'
import { api } from '@/config/api'
import { Loader } from 'lucide-react'
import { EmptyState } from './empty-state'
import { Idea } from '@/interfaces/idea'
import { IdeaCard } from './idea-card'

export const FeedIdeas = () => {

    const [ideas, setIdeas] = useState<Idea[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [moreLoading, setMoreLoading] = useState(false)

    useEffect(() => {
        const fetchInitialIdeas = async () => {
            try {
                setLoading(true)
                const res = await api.get(`/feed?page=1`)
                if (res.status === 200) {
                    setIdeas(res.data.ideas)
                    setTotalPages(res.data.totalPages)
                }
            } catch {
                // Handle error
            } finally {
                setLoading(false)
            }
        }
        fetchInitialIdeas()
    }, [])

    useEffect(() => {
        if (page === 1) return

        const fetchMoreIdeas = async () => {
            setMoreLoading(true)
            try {
                const res = await api.get(`/feed?page=${page}`)
                if (res.status === 200) {
                    setIdeas(prev => [...prev, ...res.data.ideas])
                }
            } catch {
            } finally {
                setMoreLoading(false)
            }
        }

        fetchMoreIdeas()
    }, [page])

    return (
        <div>
            {ideas.length > 0 && !loading &&
                ideas.map((idea) => (
                    <IdeaCard key={idea._id} idea={idea} isCurrentUser={false} />
                ))
            }

            {loading && (
                <div className="flex flex-col justify-center items-center dark:text-white/50 text-black/50 text-xs">
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Loading ideas</span>
                </div>
            )}

            {!loading && ideas.length === 0 && (
                <EmptyState message="No posts found" description="Posts will appear here if available." />
            )}

            {moreLoading && (
                <div className="flex justify-around">
                    <span className="my-2 dark:text-white/50 text-black/50 text-sm">Loading...</span>
                </div>
            )}

            {page < totalPages && !loading && !moreLoading && (
                <div className="flex justify-around">
                    <span
                        className="my-2 dark:text-white/50 text-black/50 text-sm cursor-pointer"
                        onClick={() => setPage(prev => prev + 1)}
                    >
                        Load more ideas
                    </span>
                </div>
            )}
        </div>
    )
}
