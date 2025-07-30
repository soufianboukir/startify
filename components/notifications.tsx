'use client'

import React, { useEffect, useState } from 'react'
import { api } from '@/config/api'
import { Notification } from '@/interfaces/notification'
import { Bell, Check } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'

export const Notifications = () => {
    const [notifications,setNotifications] = useState<Notification[]>([])
    const [loading,setLoading] = useState(false)
    const [open,setOpen] = useState(false)

    const getNotifications = async () =>{
        const res = await api.get(`/notifications`)
        if(res.data.notifications){
            setNotifications(res.data.notifications)
        }
    }

    useEffect(() =>{
        getNotifications()
    },[])

    const markAllAsRead = async () =>{
        try{
            setLoading(true)
            const res = await api.post(`/notifications`);
            if(res.status === 200){
                const updatedNotifications = notifications.map((notification) => ({
                    ...notification,
                    seen: true,
                }));
                setNotifications(updatedNotifications);
            }
        }catch{
            toast.error('An error occured')
        }finally{
            setLoading(false)
        }
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div className='relative'>
                    <Bell className="w-5 h-5 hidden md:block cursor-pointer" />
                    {
                        notifications.some((notification) => !notification.seen) ?
                            <div>
                                <span className="absolute -top-0.5 -right-1 w-2 h-2 bg-red-500 rounded-full md:block hidden"></span>
                            </div>
                        :null
                    }
                </div>
            </PopoverTrigger>
            <PopoverContent 
                className="w-96 p-0 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800"
                align="end"
            >
                <div className="p-4 rounded-t-xl border-b">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold">Notifications</h4>
                        <span className="text-xs text-blue-600 dark:text-blue-400 cursor-pointer hover:underline" onClick={markAllAsRead}>
                            {
                                loading ?"Loading..." : "Mark all as read"
                            }
                        </span>
                    </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                    {notifications && notifications.map((notification, idx) => (
                        <Link
                            href={notification.link!}
                            key={idx}
                            onClick={() => setOpen(false)}
                            className={cn(
                            "p-4 border-b cursor-pointer transition-all duration-300",
                            "flex items-start gap-4",
                            !notification.seen && "bg-gray-100 hover:bg-gray-200 dark:bg-muted/30 dark:hover:bg-muted/60"
                            )}
                        >
                            <div className="flex-shrink-0">
                                <Avatar>
                                    <AvatarImage src={notification.fromUser?.image}/>
                                    <AvatarFallback>{notification.fromUser?.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </div>

                            <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                                        {notification.type}
                                    </h4>

                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">
                                        {notification.content}
                                    </p>
                                </div>

                                {notification.seen && (
                                    <Check className="w-4 h-4 text-green-500 mt-1" />
                                )}
                            </div>

                            <span className="text-xs text-gray-400 dark:text-gray-500 mt-2 block">
                                {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                            </span>
                            </div>

                            {!notification.seen && (
                                <div className="mt-1 bg-blue-600 px-1 rounded-xs text-[12px] text-white font-medium">
                                    new
                                </div>
                            )}
                        </Link>
                    ))}

                </div>
                <div className="p-3 text-center rounded-b-xl">
                    <span className="text-xs text-blue-600 dark:text-blue-400 cursor-pointer hover:underline" onClick={() => setOpen(false)}>
                        <Link href={'/notifications'}>
                            View all notifications
                        </Link>
                    </span>
                </div>
            </PopoverContent>
        </Popover>
    )
}
