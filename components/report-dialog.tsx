'use client'

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { api } from "@/config/api"
import { Flag, Loader } from "lucide-react"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { toast } from "sonner"


type DeleteDialogProps = {
    ideaId?: string
    commentId?: string
    userId?: string
    type?: 'Comment' | 'Idea' | 'User'
}

const reportReasons = [
    'Spam',
    'Harassment',
    'Hate Speech',
    'False Information',
    'Inappropriate Content',
    'Plagiarism',
    'Offensive Language',
    'Scam or Fraud',
    'Impersonation',
    'Other',
  ];
  


export function ReportDialog({ ideaId, commentId, userId, type }: DeleteDialogProps) {

    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [reason,setReason] = useState('')
    const disableBtn = reason === ''
    const { data: session, status } = useSession()

    const handleSubmit = async () => {
        if( !session?.user.id ) {
            toast.error('You must be logged in to report')
            return
        }
        if (disableBtn) return
        setLoading(true)

        try {
            const res = await api.post(`/reports`, {ideaId, commentId, userId, reason})
            if (res.status === 200) {
                toast.success(`${type} has been reported`)
                setOpen(false)
                setReason('')
            }
        } catch {
            toast.error('An error occured. Try again')
        } finally {
            setLoading(false)
        }
    }
    if( status === 'loading') return null
    return (
        <Dialog open={open} onOpenChange={() => setOpen(!open)}>
            <form>
                <DialogTrigger asChild>
                    <button className="flex items-center gap-2 px-2 py-1 cursor-pointer text-sm">
                        <Flag className="w-4 h-4" />
                        Report
                    </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[520px]">
                    <DialogHeader>
                        <DialogTitle>Report {type}</DialogTitle>
                        <DialogDescription>
                            {
                            type === 'Idea' &&
                                "You're reporting this idea. If it violates our guidelines (spam, abuse, plagiarism), it will be reviewed by admin and may be removed."
                            }
                            {
                            type === 'Comment' &&
                                "You're reporting this comment. If it contains offensive, irrelevant, or harmful content, it will be reviewed by admin."
                            }
                            {
                            type === 'User' &&
                                "You're reporting this user. If they are engaging in harassment, impersonation, or other violations, action may be taken after review."
                            }
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="reason" className="dark:text-white/70 text-black/70">
                                Please select a reason for this action:
                            </Label>
                            <div className="grid gap-2" id="reason">
                                {reportReasons.map((r) => (
                                <label key={r} className="flex items-center gap-2">
                                    <input
                                    type="radio"
                                    name="reason"
                                    value={r}
                                    checked={reason === r}
                                    onChange={(e) => setReason(e.target.value)}
                                    />
                                    <span className="dark:text-white/70 text-black/70">{r}</span>
                                </label>
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={handleSubmit} className="bg-red-500 text-white hover:bg-red-600" disabled={disableBtn || loading}>
                            {
                                loading ?
                                    <>
                                        <Loader className="w-4 h-4 animate-spin" /> reporting
                                    </>
                                    : "Report"
                            }
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}
