'use client'

import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { api } from '@/config/api'
import { User } from '@/interfaces/user'
import { format } from 'date-fns'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Eye, Loader } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { DeleteDialog } from '@/components/delete-dialog'


const  Users = ()  => {
    const [users, setUsers] = useState<User[]>([])
    const [page, setPage] = useState(1)
    const [loading,setLoading] = useState(true)
    const [totalPages,setTotalPages] = useState(0)
    const [searchInput,setSearchInput] = useState('')
    const [searchLoading,setSearchLoading] = useState(false)
    const disablePrev = page === 1
    const disableNext = page >= totalPages


    useEffect(() => {
        if(searchInput === '') { setSearchLoading(false); return }
        setSearchLoading(true);
        const debounceTimeout = setTimeout(() => {
          const searchUsers = async () => {
            try {
              const res = await api.get(`/admin/searchUsers?query=${searchInput}`);
              if (res.status === 200) {
                setUsers(res.data.users);
              }
            } catch {
              // optional: handle error
            } finally {
              setSearchLoading(false);
            }
          };
          
          searchUsers();
        }, 3000);
      
        return () => clearTimeout(debounceTimeout);
      }, [searchInput]);

    useEffect(() => {
        const getUsers = async () =>{
            setLoading(true)
            try{
                const res = await api.get(`/admin/users?page=${page}`)
                if(res.status === 200){
                    setUsers(res.data.users)
                    setTotalPages(res.data.totalPages)
                }
            }catch{

            }finally{
                setLoading(false)
            }
        }
        if(searchInput === ''){
            getUsers()
        }
    }, [page, searchInput])

    if(loading) return <div className="flex flex-col justify-center items-center dark:text-white/50 text-black/50 text-xs">
                            <Loader className="w-5 h-5 animate-spin" />
                            <span>Loading users</span>
                        </div>
  return (
   <div>
        <div className='flex gap-2 items-center'>
            <Input type='text' className='w-[100%] md:w-[30%]' placeholder='Type to search users' value={searchInput} onChange={(e) => setSearchInput(e.target.value)}/>
            {
                searchLoading && <Loader className="w-5 h-5 animate-spin dark:text-white/50 text-black/50" />
            }
        </div>  
        <Table>
            <TableCaption>A list of all users (page {page}).</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px] text-center">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Headline</TableHead>
                    <TableHead>Joined at</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user) => (
                <TableRow key={user._id}>
                    <TableCell className="font-medium">{user._id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.headLine}</TableCell>
                    <TableCell>{format(user.createdAt!,'dd-MM-yyyy')}</TableCell>
                    <TableCell className="text-right">
                        <div className='flex gap-2 items-center justify-center'>
                            <Link href={`/${user.username}`} className='text-blue-500 flex items-center gap-2'><Eye className='w-4 h-4'/> View</Link>
                            <DeleteDialog type='User' userId={user._id}/>
                        </div>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            <TableFooter>
                <TableRow>
                <TableCell colSpan={6} className="text-right">
                    Total Users: {users.length}
                </TableCell>
                </TableRow>
            </TableFooter>
        </Table>

        <div className='mt-3 flex justify-between'>
            <Button disabled={disablePrev} onClick={() => setPage(page-1)}>
                <ChevronLeft /> Previus
            </Button>
            <Button disabled={disableNext} onClick={() => setPage(page+1)}>
                Next <ChevronRight />
            </Button>
        </div>
   </div>
  )
}


export default Users;