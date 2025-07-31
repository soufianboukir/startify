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
import { DeleteDialog } from '@/components/delete-dialog'
import { Eye, Loader } from 'lucide-react'
import { AdminForm } from '@/components/admin-form'


const  Admins = ()  => {
    const [admins, setAdmins] = useState<User[]>([])
    const [loading,setLoading] = useState(true)

    useEffect(() => {
        const getAdmins = async () =>{
            setLoading(true)
            try{
                const res = await api.get(`/admin/delete-requests`)
                if(res.status === 200){
                    setAdmins(res.data.admins)
                }
            }catch{

            }finally{
                setLoading(false)
            }
        }
        getAdmins()
    }, [])

    if(loading) return <div className="flex flex-col justify-center items-center dark:text-white/50 text-black/50 text-xs">
                            <Loader className="w-5 h-5 animate-spin" />
                            <span>Loading requests</span>
                        </div>
  return (
   <div> 
    <AdminForm />
        <Table>
            <TableCaption>A list of all delete requests.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px] text-center">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Headline</TableHead>
                    <TableHead>Created at</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {admins.map((admin) => (
                <TableRow key={admin._id}>
                    <TableCell className="font-medium">{admin._id}</TableCell>
                    <TableCell>{admin.name}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>{admin.headLine}</TableCell>
                    <TableCell>{format(admin.createdAt!,'dd-MM-yyyy')}</TableCell>
                    <TableCell className="text-right">
                        <div className='flex gap-2 items-center justify-center'>
                            <Link href={`/${admin.username}`} className='text-blue-500 flex items-center gap-2'><Eye className='w-4 h-4'/> View</Link>
                            <DeleteDialog type='Admin' userId={admin._id}/>
                        </div>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            <TableFooter>
                <TableRow>
                <TableCell colSpan={6} className="text-right">
                    Total Users: {admins.length}
                </TableCell>
                </TableRow>
            </TableFooter>
        </Table>
   </div>
  )
}


export default Admins;