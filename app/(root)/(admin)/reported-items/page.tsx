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
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Eye, Loader } from 'lucide-react'
import { Report } from '@/interfaces/report'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { DeleteDialog } from '@/components/delete-dialog'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'


const  ReportedIdeas = ()  => {
    const [reportedItems, setReportedItems] = useState<Report[]>([])
    const [page, setPage] = useState(1)
    const [loading,setLoading] = useState(true)
    const [totalPages,setTotalPages] = useState(0)
    const disablePrev = page === 1
    const disableNext = page >= totalPages


    useEffect(() => {
        const getUsers = async () =>{
            setLoading(true)
            try{
                const res = await api.get(`/admin/reported?page=${page}`)
                if(res.status === 200){
                    setReportedItems(res.data.reports)
                    setTotalPages(res.data.totalPages)
                }
            }catch{

            }finally{
                setLoading(false)
            }
        }
        getUsers()
    }, [page])

    if(loading) return <div className="flex flex-col justify-center items-center dark:text-white/50 text-black/50 text-xs">
                            <Loader className="w-5 h-5 animate-spin" />
                            <span>Loading reported items</span>
                        </div>
  return (
   <div>
        <Table>
            <TableCaption>A list of all reported ideas (page {page}).</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="text-center">ID</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Reported By</TableHead>
                    <TableHead>Date</TableHead>
                </TableRow>
                </TableHeader>

                <TableBody>
                {reportedItems.map((report) => (
                    <TableRow key={report._id}>
                        <TableCell className="font-medium text-center">{report._id}</TableCell>
                        <TableCell className="capitalize">{report.reason}</TableCell>
                        <TableCell>
                            {
                                report.reportedComment && <Badge>comment</Badge>
                            }
                            {
                                report.reportedUser && <Badge variant='secondary'>User</Badge>
                            }
                            {
                                report.reportedIdea && <Badge variant='destructive'>Idea</Badge>
                            }
                        </TableCell>
                        <TableCell>
                            <Link href={`/${report.reportedBy.username}`} className='hover:text-blue-500 hover:underline duration-200'>{report.reportedBy.username}</Link>
                        </TableCell>
                        <TableCell>{new Date(report.createdAt!).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                            <div className='flex gap-2 items-center justify-center'>
                               {
                                report.reportedIdea && (
                                    <>
                                        <Link href={`/idea/${report.reportedIdea._id}`} className='text-blue-500 flex items-center gap-2'><Eye className='w-4 h-4'/> View</Link>
                                        <DeleteDialog type='Idea' userId={report.reportedIdea._id}/>
                                    </>
                                )
                               }
                               {
                                report.reportedUser && (
                                    <>
                                        <Link href={`/idea/${report.reportedUser._id}`} className='text-blue-500 flex items-center gap-2'><Eye className='w-4 h-4'/> View</Link>
                                        <DeleteDialog type='Idea' userId={report.reportedUser._id}/>
                                    </>
                                )
                               }
                               {
                                report.reportedComment && (
                                    <>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <span className='text-blue-500 flex items-center gap-2 cursor-pointer'><Eye className='w-4 h-4'/> View</span>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px]">
                                                <DialogHeader>
                                                    <DialogTitle>Reported comment</DialogTitle>
                                                    <DialogDescription>
                                                        {
                                                            report.reportedComment.content
                                                        }
                                                    </DialogDescription>
                                                </DialogHeader>
                                            </DialogContent>
                                        </Dialog>
                                        <DeleteDialog type='Comment' userId={report.reportedComment._id}/>
                                    </>
                                )
                               }
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <TableFooter>
                <TableRow>
                <TableCell colSpan={6} className="text-right">
                    Total : {reportedItems.length}
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


export default ReportedIdeas;