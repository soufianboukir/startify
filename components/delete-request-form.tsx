'use client'

import { useState } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { api } from "@/config/api"

export function DeleteRequest() {
    const [reason, setReason] = useState("")
    const [loading, setLoading] = useState(false)
    const [success,setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSuccess(false)
        if (!reason.trim()) {
            toast.error("Reason is required")
            return
        }

        setLoading(true)
        try {
        const res = await api.post(`/user/requestToDelete`,{reason})

        if(res.status === 200){
            toast.success("Your request has been submitted")
            setReason("")
            setSuccess(true)
        }
        } catch {
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

  return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="bg-red-500 text-white dark:bg-red-500 dark:hover:bg-red-600 cursor-pointer hover:bg-red-600 hover:text-white">Request Account Deletion</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                <DialogHeader> 
                    <DialogTitle>Delete Account</DialogTitle>
                    <DialogDescription>
                        Please explain your reason for requesting account deletion.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="reason">Reason</Label>
                            <Textarea
                                id="reason"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Write your reason here..."
                                required
                            />
                            {
                                success && <p className="text-sm text-green-600">The request to delete your account has been submitted. the admin may contact you to confirm your request!</p>
                            }
                        </div>
                </div>

                <DialogFooter>
                        <DialogClose asChild>
                        <Button variant="outline" type="button" disabled={loading}>
                            Cancel
                        </Button>
                        </DialogClose>
                        <Button type="submit" disabled={loading}>
                        {loading ? "Submitting..." : "Submit Request"}
                        </Button>
                </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
  )
}
