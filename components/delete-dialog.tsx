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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/config/api"
import { Loader, Trash2, UserMinus } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"


type DeleteDialogProps = {
    ideaId?: string
    commentId?: string
    followerId?: string
    type?: 'Comment' | 'Idea' | 'Follower'
}


export function DeleteDialog({ ideaId, commentId, followerId, type }: DeleteDialogProps) {

    const [loading, setLoading] = useState(false)
    const [input, setInput] = useState('')
    const [open, setOpen] = useState(false)
    const disableBtn = input !== 'really want to delete it'

    const handleSubmit = async () => {
        if (disableBtn) return
        setLoading(true)

        try {
            if( type === 'Idea'){
                const res = await api.delete(`/ideas/${ideaId}`)
                if (res.status === 200) {
                    toast.success('Idea has been deleted')
                    setOpen(false)
                    setInput('')
                }
            }else if (type === 'Comment'){
                const res = await api.delete(`/comments/delete/${commentId}`)
                if (res.status === 200) {
                    toast.success('Comment has been deleted')
                    setOpen(false)
                    setInput('')
                }
            }else if(type === 'Follower'){
                const res = await api.delete(`/user/follow/removeFollower/${followerId}`)
                if (res.status === 200) {
                    toast.success('Follower has been deleted')
                    setOpen(false)
                    setInput('')
                }
            }
        } catch {
            toast.error('An error occured. Try again')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={() => setOpen(!open)}>
            <form>
                {
                    type !== 'Follower' && (
                        <DialogTrigger asChild>
                            <button className="flex items-center gap-2 text-red-500 px-2 py-1 cursor-pointer text-sm">
                                <Trash2 className="w-4 h-4 text-red-500" />
                                Delete
                            </button>
                        </DialogTrigger>
                    )
                }
                {
                    type === 'Follower' && (
                        <DialogTrigger asChild>
                            <button className="flex items-center gap-2 bg-red-500 px-2 py-1 cursor-pointer text-sm rounded-sm">
                                <UserMinus className="w-4 h-4 text-white" />
                            </button>
                        </DialogTrigger>
                    )
                }
                <DialogContent className="sm:max-w-[520px]">
                    <DialogHeader>
                        <DialogTitle>Delete {type}</DialogTitle>
                        <DialogDescription>
                            {
                                type === 'Idea' && "Deleting an idea is permanent and cannot be undone. This action will remove the idea from your profile and make it unavailable to other users."
                            }
                            {
                                type === 'Comment' && "Are you sure you want to delete the comment?"
                            }
                            {
                                type === 'Follower' && "Are you sure you want to delete the follower?"
                            }
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="name-1" className="dark:text-white/70 text-black/70">Please type <strong className="dark:text-white text-black">really want to delete it</strong> to confirm</Label>
                            <Input id="name-1" name="name" value={input} onChange={(e) => setInput(e.target.value)} />
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
                                        <Loader className="w-4 h-4 animate-spin" /> deleting
                                    </>
                                    : "Delete"
                            }
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}
