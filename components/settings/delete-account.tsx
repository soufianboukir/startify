'use client'

import { Button } from '../ui/button'

export const DeleteAccount = () => {
    return (
        <div className='bg-muted/20 rounded-md pt-4 border border-red-900/90'>
            <div className='flex justify-between items-center px-5 md:px-10'>
                <div>
                    <h1 className='text-2xl font-semibold mb-3'>Delete account</h1>
                    <p className='text-sm mb-3'>Permanently remove your Personal Account and all of its contents from the Vercel platform. This action is not reversible, so please continue with caution.</p>
                </div>
            </div>

            <div className='border-t mt-2 md:px-10 px-5 flex justify-end py-3 items-center bg-red-900/30'>
                <Button className='bg-red-500 text-white cursor-pointer hover:bg-red-400'>
                    Delete personal account
                </Button>
            </div>
        </div>
    )
}
