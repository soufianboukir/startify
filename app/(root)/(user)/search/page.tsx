import SearchPage from '@/components/search-results'
import { Loader } from 'lucide-react'
import React, { Suspense } from 'react'


export default function Search() {
    return (
        <div>
            <Suspense fallback={<div className="flex flex-col justify-center items-center dark:text-white/50 text-black/50 text-xs">
                                        <Loader className="w-5 h-5 animate-spin" />
                                        <span>Loading search</span>
                                    </div>}>
                <SearchPage />
            </Suspense>
        </div>
    )
}