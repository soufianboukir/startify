'use client'

import { useEffect, useState } from 'react'
import { DeleteRequest } from '../delete-request-form'
import { Loader } from 'lucide-react'
import { api } from '@/config/api'

export const DeleteAccount = () => {
    const [status, setStatus] = useState<'loading' | 'exists' | 'not-exists'>('loading')

    useEffect(() => {
        const checkDeleteRequest = async () => {
            try {
                const res = await api.get('/user/requestToDelete/check')
                if (res.data.exists) {
                    setStatus('exists')
                } else {
                    setStatus('not-exists')
                }
            } catch (err) {
                console.error('Failed to check delete request status:', err)
                setStatus('not-exists') 
            }
        }

        checkDeleteRequest()
    }, [])

    return (
        <div className='bg-muted/20 rounded-md pt-4 border'>
        <div className='flex justify-between items-center px-5 md:px-10'>
            <div>
            <h1 className='text-2xl font-semibold mb-3'>Delete account</h1>
            <p className='text-sm mb-3'>
                Permanently remove your Personal Account and all of its contents from the platform.
                This action is not reversible, so please continue with caution.
            </p>
            </div>
        </div>

        <div className='border-t mt-2 md:px-10 px-5 py-4 bg-red-300/30 dark:bg-red-900/10'>
            {status === 'loading' ? (
            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <Loader className='animate-spin h-4 w-4' />
                Checking delete request status...
            </div>
            ) : status === 'exists' ? (
            <p className='text-red-600 text-sm'>You already have a pending account deletion request.</p>
            ) : (
            <div className='flex justify-end'>
                <DeleteRequest />
            </div>
            )}
        </div>
        </div>
    )
}
