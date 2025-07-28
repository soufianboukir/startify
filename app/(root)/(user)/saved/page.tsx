'use client'

import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
// import { Avatar, AvatarImage } from '@/components/ui/avatar';
// import { cn } from '@/lib/utils';
// import Link from 'next/link';
import { toast } from 'sonner';
import { Notification } from '@/interfaces/notification';
import { api } from '@/config/api';
// import { formatDistanceToNow } from 'date-fns';
// import { EmptyState } from '@/components/empty-state';

const SavedPage = () => {
    const [ideas,setIdeas] = useState<Notification[]>([]);
    const [loading,setLoading] = useState<boolean>(true);
    const [page,setPage] = useState<number>(1);
    const [totalPages,setTotalPages] = useState<number>(1);
    const disablePrev = page === 1
    const disableNext = page === totalPages

    const fetchNotifications = async (currentPage: number) => {
        try {
            const response = await api.get(`/saves?page=${currentPage}`)
            if (response.status === 200) {
                setIdeas(response.data.saves);
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

    const handleNext = () =>{
        if (page < totalPages!) {
            setPage(page+1)
        }
    }

    const handlePrev = () =>{
        if (page > 1){
            setPage(page - 1)
        }
    }

    if (loading) return <div className='h-[80vh] items-center justify-center gap-6 p-6 md:p-10 flex'>
        <Loader className='w-8 h-8 animate-spin'/>
    </div>;

    return (
      <div className="max-w-2xl mx-auto">
          {
            ideas && ideas.length ? (
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">Saved ideas</h1>
                </div>
            ): null
          }
        
          <div className="space-y-2">
              {/* {ideas && ideas.length > 0 ? (
                ideas.map((idea) => (
                    <Link
                        key={notification._id}
                        href={notification.link!}
                        className={cn(
                            "flex items-start gap-4 p-4 rounded-lg border hover:bg-blue-50 dark:hover:bg-muted/10 transition-colors",
                            !notification.seen && "bg-blue-100/50 dark:bg-muted/40"
                        )}
                    >
                    <Avatar className="h-10 w-10">
                        {
                        notification.fromUser?.image ? 
                            <AvatarImage src={notification.fromUser.image} />
                        : <div className={`w-10 h-10 flex justify-center items-center rounded-full`}>
                                {
                                    notification.fromUser?.username.charAt(0)
                                }
                            </div>
                        } 
                    </Avatar>
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">
                                        <span className='text-blue-400'>{notification?.type}</span> 
                                    </p>
                                    <p className='text-sm'>{notification.content}</p>
                                </div>
                                <div className='flex gap-2 items-center'>
                                    <div className='bg-blue-500 text-white text-[12px] px-1 rounded-xs font-medium'>
                                        {
                                            !notification.seen && "new"
                                        }
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                </div>
                            </div>
                            <div className="flex items-center mt-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3 mr-1" />
                                {
                                    formatDistanceToNow(notification.createdAt, { addSuffix: true })
                                }
                            </div>
                        </div>
                    </Link>
                ))
              ) : (
                <EmptyState message='No saved found' description='No saved ideas was found. your saved ideas will be appear here'/>
              )} */}
          </div>
          <br />

          {
            ideas && ideas.length ?
                <div className='flex justify-between'>
                    <Button onClick={handlePrev} className='cursor-pointer' disabled={disablePrev}>
                        <ChevronLeft /> Previews
                    </Button>
                    <Button onClick={handleNext} className='cursor-pointer' disabled={disableNext}>
                        Next <ChevronRight /> 
                    </Button>
                </div>
            :null
          }
      </div>
    );
};

export default SavedPage;