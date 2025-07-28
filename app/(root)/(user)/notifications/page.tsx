'use client'

import React, { useEffect, useState } from 'react';
import { Bell, ChevronRight, Clock, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { toast } from 'sonner';
import { Notification } from '@/interfaces/notification';
import { api } from '@/config/api';
import { formatDistanceToNow } from 'date-fns';

const NotificationsPage = () => {
    const [notifications,setNotifications] = useState<Notification[]>([]);
    const [loading,setLoading] = useState<boolean>(true);
    const [page,setPage] = useState<number>(1);
    const [totalPages,setTotalPages] = useState<number>(1);

    const fetchNotifications = async (currentPage: number) => {
        try {
            const response = await api.get(`/notifications?page=${currentPage}`)
            if (response.status === 200) {
                setNotifications(response.data.notifications);
                setTotalPages(response.data.totalPages);
            } else {
                toast.error('Operation failed', {
                    description: response.data.message,
                });
            }
        } catch {
            toast.error('Operation failed', {
                description: 'Internal server error',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications(page);
    }, [page]);

    if (loading) return <div className='bg-muted min-h-svh items-center justify-center gap-6 p-6 md:p-10 flex'>
        <Loader className='w-8 h-8 animate-spin'/>
    </div>;
    return (
      <div className="max-w-2xl mx-auto p-4">
          <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Notifications</h1>
              <Button variant="ghost" className="text-primary">
                  Mark all as read
              </Button>
          </div>
        
          <div className="space-y-2">
              {notifications && notifications.length > 0 ? (
                notifications.map((notification) => (
                    <Link
                        key={notification._id}
                        href={notification.link!}
                        className={cn(
                            "flex items-start gap-4 p-4 rounded-lg border hover:bg-muted transition-colors",
                            !notification.seen && "bg-blue-50/50 dark:bg-blue-900/10"
                        )}
                    >
                    <Avatar className="h-10 w-10">
                        {
                        notification.fromUser?.image ? 
                            <AvatarImage src={notification.fromUser.image} />
                        : <div className={`w-10 h-10 flex justify-center items-center rounded-full ${notification.fromUser.defaultColor}`}>
                                {
                                    notification.fromUser?.username.charAt(0)
                                }
                            </div>
                        } 
                    </Avatar>
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <p className="font-medium">
                                    {notification?.fromUser?.name} {notification.content}
                                </p>
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="flex items-center mt-1 text-sm text-muted-foreground">
                                <Clock className="h-3 w-3 mr-1" />
                                {
                                formatDistanceToNow(notification.createdAt, { addSuffix: true })
                                }
                            </div>
                        </div>
                    </Link>
                ))
              ) : (
              <div className="text-center py-12">
                  <div className="mx-auto h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-4">
                      <Bell className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No notifications</h3>
                  <p className="text-muted-foreground">When you get notifications, they will appear here</p>
              </div>
              )}
          </div>
          <br />
          {/* {
              notifications && notifications.length ? (
                  <PaginationControls
                      previous={() => handlePrevious({ page, setPage, getMore: fetchNotifications})}
                      next={() => handleNext({page,totalPages,setPage,getMore:fetchNotifications})} />
              ) : null
          } */}
      </div>
    );
};

export default NotificationsPage;