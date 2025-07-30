'use client'
import { api } from '@/config/api'
import { Loader, UserMinus, UserPlus } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { Button } from './ui/button'

export const FollowButton = ({ userId, isFollowing, onlySVG }: { userId: string, isFollowing: boolean, onlySVG?: boolean }) => {
    const [loading,setLoading] = useState(false)
    const [isFollowingState,setIsFollowingState] = useState(isFollowing)

    const toggleFollow = async () =>{
        try{
            setLoading(true)
            const res = await api.post('/user/follow',{ followingId: userId})
            if(res.status === 200){
                if(res.data.status === 'followed'){
                    setIsFollowingState(true)
                }else{
                    setIsFollowingState(false)
                }
            }
        }catch{
            toast.error("An error occured")
        }finally{
            setLoading(false)
        }
    }
    return (
        <Button className='bg-blue-600 text-white px-2 h-7 rounded-xs flex gap-1 items-center font-medium text-xs cursor-pointer hover:bg-blue-700 duration-200' disabled={loading} onClick={toggleFollow}>
            {
                isFollowingState ?
                    <>
                        {
                            loading ? <>
                                {
                                    onlySVG ? 
                                        <Loader className='animate-spin w-4 h-4'/>
                                    :
                                    <>
                                        <Loader className='animate-spin w-4 h-4'/>
                                        loading ...
                                    </>
                                }
                            </>
                             : <>
                                {
                                    onlySVG ? 
                                        <UserMinus className='w-4 h-4'/>
                                    :
                                    <>
                                        <UserMinus className='w-4 h-4'/>
                                        unfollow user
                                    </>
                                }
                            </>
                        }
                    </>
                : <>
                    {
                        loading ?<>
                                {
                                    onlySVG ? 
                                        <Loader className='animate-spin w-4 h-4'/>
                                    :
                                    <>
                                        <Loader className='animate-spin w-4 h-4'/>
                                        loading ...
                                    </>
                                }
                        </>
                            : <>
                                {
                                    onlySVG ? 
                                        <UserPlus className='w-4 h-4'/>
                                    :
                                    <>
                                        <UserPlus className='w-4 h-4'/>
                                        follow user
                                    </>
                                }
                        </>
                    }
                </>
            }
        </Button>
    )
}
