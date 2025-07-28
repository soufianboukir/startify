'use client'

import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { api } from '@/config/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Save } from '@/interfaces/save';
import { IdeaMenu } from '@/components/idea-menu';
import Votes from '@/components/votes';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { EmptyState } from '@/components/empty-state';

const SavedPage = () => {
    const [items,setItems] = useState<Save[]>([]);
    const [loading,setLoading] = useState<boolean>(true);
    const [page,setPage] = useState<number>(1);
    const [totalPages,setTotalPages] = useState<number>(1);
    const disablePrev = page === 1
    const disableNext = page === totalPages

    const fetchNotifications = async (currentPage: number) => {
        try {
            const response = await api.get(`/saves?page=${currentPage}`)
            console.log(response);
            
            if (response.status === 200) {
                setItems(response.data.saves);
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
        <div className="max-w-7xl px-3 mx-auto">
            {
                items && items.length ? (
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold">Saved ideas</h1>
                    </div>
                ): null
            }
            {
                items && items.length === 0 ?
                    <EmptyState message='No saved items' description='Your saved items will be appear here'/>
                :null
            }

            <div className="space-y-2 grid md:grid-cols-2 grid-cols-1 lg:grid-cols-3 gap-3">
                {
                    items && items.length ? items.map((item: Save) => (
                        <div key={item._id} className='dark:bg-muted/30 bg-gray-100/70 rounded-sm px-3 py-2 cursor-pointer'>
                            <div className='flex justify-between items-center'>
                                <div className='flex gap-2 items-center'> 
                                    <Avatar>
                                        <AvatarImage src={item.idea.author.image} />
                                        <AvatarFallback>{item.idea.author.name.charAt(0)}</AvatarFallback>
                                    </Avatar>

                                    <div className='flex flex-col'>
                                        <span className='font-semibold'>{item.idea.author.name}</span>
                                        <span className='text-xs font-medium'>{item.idea.author.username}</span>
                                    </div>
                                </div>

                                <IdeaMenu isCurrentUser={false} idea={item.idea} saved={true}/>
                            </div>

                            <div className='mt-3'>
                                <Link href={`/idea/${item.idea._id}`} className='font-semibold mb-2 hover:underline duration-100'>{item.idea.title}</Link>
                                <span className='text-sm italic line-clamp-4'>{item.idea.description}</span>
                            </div>

                            <div className='mt-2 flex justify-between items-center'>
                                <Votes ideaId={item.idea._id} upVotes={item.idea.upVotes} downVotes={item.idea.downVotes}/>
                                <span className='text-xs'>Saved {formatDistanceToNow(item.createdAt, {addSuffix: true})}</span>
                            </div>
                        </div>
                    )) : null
                }
            </div>
            <br />

            {
                items && items.length ?
                    <div className='flex justify-between mb-2'>
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