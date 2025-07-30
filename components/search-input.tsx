"use client"

import * as React from "react"
import {
  Loader2,
} from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Input } from "./ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Idea } from "@/interfaces/idea"
import { api } from "@/config/api"
import { User } from "@/interfaces/user"

export function SearchInput() {
    const [open, setOpen] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [suggestedUsers, setSuggestedUsers] = React.useState([])
    const [results, setResults] = React.useState({users: [],ideas: []})
    const router = useRouter()
    const [inputValue, setInputValue] = React.useState('')
    const searchTimeout = React.useRef<NodeJS.Timeout | null>(null)

    const handleDebouncedSearch = (input: string) => {
      if (searchTimeout.current) {
          clearTimeout(searchTimeout.current)
      }

      if (!input.trim()) {
        setLoading(false)
          setResults({ users: [], ideas: [] })
          return
      }

      setLoading(true)

      searchTimeout.current = setTimeout(async () => {
          try {
            const res = await api.get(`/search?query=${input}`)
              if (res.status === 200) {
                  setResults({ users: res.data.users, ideas: res.data.ideas })
              }
              } catch (err) {
                  console.error("Search failed:", err)
                  setResults({ users: [], ideas: [] })
              } finally {
                  setLoading(false)
              }
          }, 500)
    }

    const handleInputChange = (value: string) => {
        setInputValue(value)
        handleDebouncedSearch(value)
    }

    const fetchSuggestedUsers = async () => {
        setLoading(true)
        try {
            const response = await api.get(`/feed/suggested`);
            if (response.status === 200) {
                setSuggestedUsers(response.data.users)
            }
        } catch (err) {
            console.error("Error fetching users", err)
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => {
      const down = (e: KeyboardEvent) => {
        if(inputValue === '' && e.key === 'Enter' && open){
          toast.error('Please type somthing')
          return
        }
        if (e.key === "Enter" && open) {
          e.preventDefault()
          router.push(`/search?query=${inputValue}`)
          setOpen((open) => !open)
        }
      }
      document.addEventListener("keydown", down)
      return () => document.removeEventListener("keydown", down)
    }, [inputValue,router,open])
  

    React.useEffect(() => {
        if (open && suggestedUsers.length === 0) {
            fetchSuggestedUsers()
        }
    }, [open,suggestedUsers.length])

  return (
    <>
        <Input
          onClick={() => setOpen(true)}
          type="text"
          placeholder="Type somthing..."
          className="md:[40%] w-[100%] px-3 py-1.5 rounded-md text-sm border border-muted bg-muted/20 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition cursor-pointer"
        />


      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type and press enter to search ideas or users..." value={inputValue} onValueChange={handleInputChange}/>
        
        <CommandList>
          {loading ? (
            <div className="flex justify-center items-center py-6">
              <Loader2 className="animate-spin w-5 h-5 text-muted-foreground" />
            </div>
          ) : (
            <>

              {suggestedUsers.length > 0 && (
                <CommandGroup heading="Suggested Developers">
                  {suggestedUsers.map((user: User,index) => (
                    <CommandItem key={user._id || index} className="p-0">
                    <Link href={`/${user.username}`} className="flex gap-2 w-full hover:bg-muted items-center" onClick={() => setOpen(false)}>
                      <Avatar className="w-7 h-7">
                        <AvatarImage src={user.image} />
                        <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">{user.name} <span className="text-xs text-muted-foreground"> @{user.username}</span></div>
                        <div className="text-xs text-muted-foreground">{user.headLine}</div>
                      </div>
                    </Link>
                  </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </>
          )}

          <CommandSeparator />

          {((results.users.length !== 0 || results.ideas.length !== 0) && !loading) && (
            <>
              { results.users.length !== 0 && <p className="dark:text-white/80 text-black/90 font-semibold text-xs mt-2 pl-2">Users</p>}
                {results.users.map((user: User) => (
                    <Link
                      key={user._id}
                      onClick={() => setOpen(false)}
                      href={`/user/${user.username}`}
                      className="flex items-center mx-2 gap-3 px-4 py-2 cursor-pointer rounded-sm text-sm hover:bg-muted hover:text-foreground transition-colors"
                      >
                        <Avatar className="w-7 h-7">
                            <AvatarImage src={user.image} />
                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">{user.name} <span className="text-xs text-muted-foreground"> @{user.username}</span></div>
                          <div className="text-xs text-muted-foreground">{user.headLine}</div>
                        </div>
                    </Link>
                ))}

                  
              { results.ideas.length !== 0 && <p className="dark:text-white/80 text-black/90 font-semibold text-xs mt-2 pl-2">Ideas</p>}
                {results.ideas.map((ideas: Idea) => (
                    <Link
                      key={ideas._id}
                      href={`/idea/${ideas._id}`}
                      className="flex flex-col mx-2 gap-1 px-4 py-2 cursor-pointer rounded-sm text-sm hover:bg-muted hover:text-foreground transition-colors"
                      >
                        <p className="text-sm font-medium">{ideas.title}</p>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                            {ideas.description}
                          </p>
                    </Link>
                ))}
                
            </>
            )}

            {
                (!loading && results.users.length === 0 && results.ideas.length === 0) &&
                    <CommandEmpty>No results matching this query</CommandEmpty>
            }
        </CommandList>
      </CommandDialog>
    </>
  )
}