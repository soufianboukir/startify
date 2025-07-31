'use client'

import { useState, useEffect, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader, Search, Send, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import { EmptyState } from '@/components/empty-state'
import Link from 'next/link'
import { toast } from 'sonner'
import { api } from '@/config/api'
import { User } from '@/interfaces/user'
import { Conversation } from '@/interfaces/conversation'
import { Message } from '@/interfaces/message'
import Pusher from 'pusher-js'
import { formatDistanceToNow } from 'date-fns'
import { useSearchParams } from 'next/navigation'


export default function MessagesPage() {
  const [query, setQuery] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [filteredConversations,setFilteredConversations] = useState<Conversation[]>([])
  const conversationsToShow = query ? filteredConversations : conversations;
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [messages, setMessages] = useState<Message[]>([])
  const [loadConvs, setLoadConvs] = useState(false)
  const [loadMssgs, setLoadMssgs] = useState(false)
  const [sending,setSending] = useState(false)
  const [user,setUser] = useState<User | null>(null)
  const { data: session, status } = useSession()
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const searchParams = useSearchParams()
  const username = searchParams.get('username')



  const fetchConversations = async () =>{
    try{
        setLoadConvs(true)
        const response = await api.get('/conversations')
        if(response.status === 200){
            setConversations(response.data.conversations)
        }
    }catch{

    }finally{
        setLoadConvs(false)
    }
  }
  
  const otherParticipant = selectedConversation?.participants.find((p: User) => p._id !== session?.user.id)

  const sendNewMessage = async () => {
    if (!newMessage.trim()){
      toast.error('Please type a message')
      return
    }

    try{
      setSending(true)
      const response = await api.post(`/messages`,{conversationId: selectedConversation._id, text: newMessage})
      if(response.status === 200){
        setNewMessage('')
      }
    }catch{
      toast.success('An error occured')
    }finally{
      setSending(false)
    }
  }

  const deleteMessageFUNCTION = async (id: string) =>{
    const res = await api.delete(`/messages/${id}`)
    return res
  }

  const deleteMessage = (id: string) => {
    toast.promise(deleteMessageFUNCTION(id),{
      loading: 'Deleting...',
      success: () => {
        setMessages(messages.filter((m) => m._id !== id))
        return 'Message delete successfully'
      },
      error: (err) => err.data.message
    })
  }

  useEffect(() =>{
    fetchConversations()
  },[])

  useEffect(() =>{
    const fetchMessagesByConversation = async () =>{
      try{
          setLoadMssgs(true)          
          const response = await api.get(`/messages/byConv?conversationId=${selectedConversation._id}`)
          if(response.status === 200){
              setMessages(response.data.messages)
          }
      }catch{
  
      }finally{
        setLoadMssgs(false)
      }
    }
    fetchMessagesByConversation()
  },[selectedConversation])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView?.({ behavior: 'smooth' })
  }, [messages])

  useEffect(() =>{
    if(username === '') return
    const getOtherUserInfo = async () =>{
        try{
            const res = await api.get(`/user?username=${username}`)        
            if(res.status === 200){
                setUser(res.data.user)
            }
        }catch{

        }finally{
            
        }
    }
    getOtherUserInfo()
  },[username])
  
  useEffect(() => {
    if (!selectedConversation && conversations.length > 0 && !user) {
      setSelectedConversation(conversations[0])
    }
  }, [conversations, selectedConversation,user])


  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    })
  
    conversations.forEach((conv) => {
      if (conv?._id) {
        const channel = pusher.subscribe(`conversation-${conv._id}`)
  
        const handleNewMessage = (data: { message: Message; conversationId: string }) => {
          const { message, conversationId } = data
        
          if (selectedConversation?._id === conversationId) {
            setMessages((prev) => [...prev, message])
          }
        
          setConversations((prevConvs) => {
            const updatedConvs = prevConvs.map((conv) =>
              conv._id === conversationId
                ? { ...conv, lastMessage: message, updatedAt: message.createdAt }
                : conv
            )
        
            return updatedConvs.sort(
              (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            )
          })
        }
        
  
        channel.bind('new-message', handleNewMessage)
  
        return () => {
          channel.unbind('new-message', handleNewMessage)
          pusher.unsubscribe(`conversation-${conv._id}`)
        }
      }
    })
  
    return () => {
      pusher.disconnect()
    }
  }, [conversations, selectedConversation?._id,session?.user.id])
  
  useEffect(() => {
    const searchConv = () => {
      const lowerTerm = query.toLowerCase();
  
      return conversations.filter((conversation) => {
        const otherParticipant = conversation.participants.find(
          (p) => p._id !== session?.user.id
        );
        if (!otherParticipant) return false;
  
        return (
          otherParticipant.name?.toLowerCase().includes(lowerTerm) ||
          otherParticipant.username?.toLowerCase().includes(lowerTerm)
        );
      });
    };
  
    if (query !== '') {
      const results = searchConv();
      setFilteredConversations(results);
    } else {
      setFilteredConversations(conversations);
    }
  }, [query, conversations, session?.user.id]);

  const startConversation = async () => {
    try {
      if (newMessage === '' || selectedConversation) return
      setSending(true)
      const res = await api.post(`/conversations`, {
        recipientId: user?._id,
        message: newMessage,
      })
      if (res.status === 200) {
        const newConv = res.data.conversation
        setNewMessage('')
        setMessages([res.data.messageContent])
        setSelectedConversation(newConv)
        setConversations((prev) => [newConv, ...prev])
      }
    } catch {
      toast.error('Failed to start conversation')
    } finally {
      setSending(false)
    }
  }



  if(status === 'loading') return null

  return (
            <div className="flex h-[90vh]">
                <div className="w-1/3 border-gray-200 bg-white dark:bg-black flex flex-col">
                    <div className="pb-6 px-5 border-b border-gray-200 dark:border-gray-800">
                        <div className="relative mt-4">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="Search conversations..."
                              value={query}
                              onChange={(e) => setQuery(e.target.value)}
                              className="pl-10 py-2 rounded-full bg-gray-100 dark:bg-muted/60 border-none focus:ring-2 focus:ring-blue-500 transition"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {conversationsToShow && conversationsToShow.map((conv) => {
                        const participant = conv?.participants?.find((p) => p._id !== session?.user.id)
                            return (
                              <div
                              key={conv._id}
                              className={cn(
                                'relative flex items-center p-4 gap-3 cursor-pointer transition-all duration-200 hover:bg-blue-50 dark:hover:bg-muted/20',
                                selectedConversation?._id === conv._id &&
                                  'bg-blue-100/30 dark:bg-muted/40 border-l-4'
                              )}
                              onClick={() => setSelectedConversation(conv)}
                            >
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={participant?.image} />
                                <AvatarFallback>{participant?.name?.charAt(0) || 'U'}</AvatarFallback>
                              </Avatar>
                            
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center">
                                  <h3 className="font-semibold truncate">{participant?.name}</h3>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatDistanceToNow(conv.updatedAt,{addSuffix: true})}
                                  </span>
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                  {conv?.lastMessage?.text}
                                </div>
                              </div>
                            
                              
                              {(conv?.lastMessage?.sender?._id !== session?.user.id && !conv?.lastMessage?.seen) && (
                                <div className="ml-2">
                                  <span className="inline-flex items-center justify-center text-xs font-bold text-white bg-blue-500 rounded-full w-3 h-3">
                                    
                                  </span>
                                </div>
                              )}
                            </div>                            
                            )
                    })}

                        {loadConvs &&  <div className="flex flex-col justify-center items-center dark:text-white/50 text-black/50 text-xs">
                                        <Loader className="w-5 h-5 animate-spin" />
                                        <span>Loading conversations</span>
                                    </div>}
                        {conversationsToShow.length === 0 && !loadConvs && (
                          <EmptyState message='No conversation found' description='Try to talk to users'/>
                        )}
                    </div>
                </div>

                <div className="w-2/3 flex flex-col">
                    {(selectedConversation || user) && (
                        <>
                            <div className="flex items-center justify-between w-full dark:bg-black/60 border-b border-gray-200 dark:border-gray-900 p-4">
                                <div className="flex gap-4 items-center">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={otherParticipant?.image || user?.image} />
                                        <AvatarFallback>{otherParticipant?.name?.charAt(0) || user?.name.charAt(0) || 'U'}</AvatarFallback>
                                    </Avatar>
                                <div>
                                    <div className="font-semibold text-lg">
                                        <Link href={`/${otherParticipant?.username || user?.username}`} className='hover:text-sky-700 duration-200'>  
                                        {otherParticipant?.name || user?.name}
                                        </Link>
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {
                                            selectedConversation && <>
                                                Last active {formatDistanceToNow(selectedConversation.updatedAt,{addSuffix: true})}
                                                </>
                                        }
                                    </div>
                                </div>
                            </div>

                            
                            </div>


                            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                            {messages && messages.map((msg) => {
                                const isOwnMessage = msg.sender._id?.toString() === session?.user.id
                                return (
                                <div key={msg._id} className={cn('flex group', isOwnMessage ? 'justify-end' : 'justify-start')}>
                                    <div
                                    className={cn(
                                        'relative max-w-xl p-4 rounded-2xl shadow transition-all duration-200',
                                        !isOwnMessage
                                        ? 'bg-white dark:bg-gray-900/90 text-gray-900 dark:text-gray-100 rounded-tl-none'
                                        : 'bg-blue-600 text-white rounded-tr-none'
                                    )}
                                    >
                                    {isOwnMessage && (
                                        <button
                                        onClick={() => deleteMessage(msg._id)}
                                        className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow cursor-pointer"
                                        title="Delete message"
                                        >
                                        <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                    <p className="leading-relaxed break-words">{msg.text}</p>
                                    <div className={cn('text-xs mt-2 opacity-70', isOwnMessage ? 'text-blue-100' : 'text-gray-500')}>
                                        {formatDistanceToNow(msg.createdAt,{ addSuffix: true})}
                                    </div>
                                    </div>
                                </div>
                                )
                            })}
                            {loadMssgs &&  <div className="flex flex-col justify-center items-center dark:text-white/50 text-black/50 text-xs">
                                                <Loader className="w-5 h-5 animate-spin" />
                                                <span>Loading messages</span>
                                            </div>}
                            <div ref={messagesEndRef} />
                            </div>

                            {
                                (selectedConversation) && (
                                    <div className="border-t border-gray-200 dark:border-gray-900 p-4 bg-white dark:bg-black/60">
                                        <div className="flex gap-3 items-center">
                                            <Input
                                                placeholder="Type your message..."
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && sendNewMessage()}
                                                className="flex-1 rounded-full bg-gray-100 dark:bg-inherit border-3 px-4 py-5 focus:ring-2 focus:ring-blue-500 transition"
                                            />
                                            <Button
                                                onClick={sendNewMessage}
                                                className="rounded-full shadow-lg transition disabled:opacity-50"
                                                disabled={!newMessage.trim() || sending}
                                            >
                                            {
                                                sending ? <Loader className='h-5 w-5 animate-spin'/> : <Send className="h-5 w-5" />
                                            }
                                            </Button>
                                        </div>
                                    </div>
                                )
                            }

                            {
                                (user && !selectedConversation) && (
                                    <div className="border-t border-gray-200 dark:border-gray-900 p-4 bg-white dark:bg-black/60">
                                        <div className="flex gap-3 items-center">
                                            <Input
                                                placeholder="Type your message..."
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && startConversation()}
                                                className="flex-1 rounded-full bg-gray-100 dark:bg-inherit border-3 px-4 py-5 focus:ring-2 focus:ring-blue-500 transition"
                                            />
                                            <Button
                                                onClick={startConversation}
                                                className="rounded-full shadow-lg transition disabled:opacity-50"
                                                disabled={!newMessage.trim() || sending}
                                            >
                                            {
                                                sending ? <Loader className='h-5 w-5 animate-spin'/> : <Send className="h-5 w-5" />
                                            }
                                            </Button>
                                        </div>
                                    </div>
                                )
                            }
                        </>
                    )}
                </div>
            </div>    
  )
}