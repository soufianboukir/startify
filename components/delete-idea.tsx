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
import { Loader, Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export function DeleteIdea({ ideaId }: { ideaId: string }) {

    const [loading, setLoading] = useState(false)
    const [input, setInput] = useState('')
    const [open, setOpen] = useState(false)
    const disableBtn = input !== 'really want to delete it'

    const handleSubmit = async () => {
        if (disableBtn) return
        setLoading(true)

        try {
            const res = await api.delete(`/ideas/${ideaId}`)
            if (res.status === 200) {
                toast.success('Idea has been deleted')
                setOpen(false)
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
                <DialogTrigger asChild>
                    <button className="flex items-center gap-2 text-red-500 px-2 py-1 cursor-pointer text-sm">
                        <Trash2 className="w-4 h-4 text-red-500" />
                        Delete
                    </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[520px]">
                    <DialogHeader>
                        <DialogTitle>Delete Idea</DialogTitle>
                        <DialogDescription>
                            Deleting an idea is permanent and cannot be undone. This action will remove the idea from your profile and make it unavailable to other users.
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
