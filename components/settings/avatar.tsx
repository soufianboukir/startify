'use client'

import { useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Session } from 'next-auth'
import { Button } from '@/components/ui/button'
import { api } from '@/config/api'
import { Loader } from 'lucide-react'
import { useSession } from 'next-auth/react'

export const ModifyAvatar = ({ session }: { session: Session }) => {
    const { update } = useSession()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [error,setError] = useState('')
    const [success,setSuccess] = useState(false)
        
    const handleAvatarClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
        setSelectedFile(file)
        setPreview(URL.createObjectURL(file))
        }
    }

    const handleUpload = async () => {
        setError('')
        setSuccess(false)
        if (!selectedFile) return
        setLoading(true)
        const formData = new FormData()
        formData.append('file', selectedFile)

        try {
            const res = await api.put(`/user/settings/update-image`,formData,{
                headers: {
                    "Content-Type" : "multipart/form-data"
                }
            })

            if(res.status === 200){
                setSuccess(true)
                await update()
            }

        } catch {
            setError('An error occured. try again')
        } finally {
            setLoading(false)
        }
    }

  return (
        <div className='bg-muted/20 rounded-md pt-4 border'>
            <div className='md:flex block justify-between items-center px-5 md:px-10'>
                <div>
                    <h1 className='text-2xl font-semibold mb-3'>Avatar & Email</h1>
                    <p className='text-sm'>This is your avatar.</p>
                    <p className='text-sm'>Click on the avatar to upload a custom one from your files.</p>
                    {
                        success && <p className='text-sm text-green-600 mt-2'>Avatar has been updated</p>
                    }
                    {
                        error && <p className='text-sm text-red-500 mt-2'>{error}</p>
                    }
                    <div className='px-3 py-2 rounded-md border mt-4 flex items-center gap-2'>
                        <p>{session.user.email}</p>
                        <span className='bg-green-700 text-green-200 font-semibold text-xs px-3 py-1 rounded-full'>verified</span>
                        <span className='bg-blue-600 text-blue-200 font-semibold text-xs px-3 py-1 rounded-full'>primary</span>
                    </div>
                </div>

                <div className='flex flex-col items-center gap-2 mt-4'>
                    <div
                        className="relative group cursor-pointer md:w-26 md:h-26 h-14 w-14"
                        onClick={handleAvatarClick}
                        >
                        <Avatar className="w-full h-full">
                            {preview ? (
                            <AvatarImage src={preview} />
                            ) : session.user.image ? (
                            <AvatarImage src={session.user.image} />
                            ) : null}
                            <AvatarFallback>{session.user.name?.charAt(0)}</AvatarFallback>
                        </Avatar>

                        <div className="absolute inset-0 bg-black/70 font-semibold rounded-full text-white text-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 border-black border-2">
                            Change
                        </div>
                    </div>
                    <input
                        ref={fileInputRef}
                        type='file'
                        accept='image/*'
                        className='hidden'
                        onChange={handleFileChange}
                    />
                    {preview && (
                        <Button onClick={handleUpload} className='mt-2' disabled={loading}>
                                    {
                                        loading ? 
                                            <>
                                                <Loader className='w-4 h-4 animate-spin' /> saving
                                            </>
                                        :"Save"
                                    }
                        </Button>
                    )}
                </div>
            </div>

            <div className='border-t py-4 mt-2 md:px-10 px-5'>
                <p className='text-sm dark:text-white/50 text-black/50'>
                An avatar is optional but strongly recommended.
                </p>
            </div>
        </div>
  )
}
