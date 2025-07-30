"use client"

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { Loader } from 'lucide-react'
import { User } from '@/interfaces/user'
import { IdeaCard } from './idea-card'
import { Idea } from '@/interfaces/idea'
import { api } from '@/config/api'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('query') || ''
  const [loading, setLoading] = useState<boolean>(true)
  const [results, setResults] = useState({ users: [], ideas: [] })

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await api.get(`/search?query=${query}`)
        if (response.status === 200) {
          setResults(response.data)
        }
      } catch {
        toast.error('An error occurred while searching')
      } finally {
        setLoading(false)
      }
    }
    fetchResults()
  }, [query])

  if(loading) return <div className='h-[80vh] items-center justify-center gap-6 p-6 md:p-10 flex'>
        <Loader className='w-8 h-8 animate-spin'/>
    </div>

  return (
            <div className="max-w-6xl mx-auto space-y-10">
                <h1 className="text-2xl font-semibold">Search Results for: &quot;<span className="text-primary">{query}</span>&quot;</h1>

                {loading ? (
                    <div className='h-[80vh] items-center justify-center gap-6 p-6 md:p-10 flex'>
                        <Loader className='w-8 h-8 animate-spin'/>
                    </div>
                ) : (
                    <>
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Users</h2>
                        {results.users.length === 0 ? (
                        <p className="text-muted-foreground">No users found.</p>
                        ) : (
                        <div className="grid gap-4">
                            {results.users.map((user: User) => (
                            <Link key={user._id} href={`/${user.username}`} className="flex items-start gap-4 border p-4 rounded-md hover:shadow-md transition justify-between">
                                <div className='flex gap-2 items-start'>
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={user.image} />
                                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 space-y-1">
                                        <div className="gap-2">
                                            <p className="font-medium">{user.name}</p>
                                            <p className="text-sm text-muted-foreground">@{user.username}</p>
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-2">{user.headLine || 'No headline provided.'}</p>
                                    </div>
                                </div>
                            </Link>
                            ))}
                        </div>
                        )}
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mt-8 mb-4">Ideas</h2>
                        {results.ideas.length === 0 ? (
                        <p className="text-muted-foreground">No ideas found.</p>
                        ) : (
                        <div className="grid gap-4">
                            {results.ideas.map((idea: Idea) => (
                                <IdeaCard key={idea._id} idea={idea} isCurrentUser={false}/>
                            ))}
                        </div>
                        )}
                    </div>
                    </>
                )}
            </div>
  )
}