'use client'

import { api } from '@/config/api'
import { Save } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

export const ToggleSave = ({ ideaId,isSaved }: {ideaId: string, isSaved?:boolean}) => {
    const [loading,setLoading] = useState(false)
    
    const toggleSave = async () =>{
        try{
            setLoading(true)
            const res = await api.post(`/saves`,{ideaId})
            if(res.status === 200){
                toast.success(res.data.message)
            }
        }catch{
            toast.error('An error occured')
        }finally{
            setLoading(false)
        }
    }
    return (
        <button onClick={toggleSave} className='flex items-center gap-2 px-2 py-1 cursor-pointer text-sm' disabled={loading}>
            <Save className="h-4 w-4"/>
            <span>
                {
                    loading ? "loading...": isSaved ? "Unsave" : "Save"
                }
            </span>
        </button>
    )
}
