"use client"

import { useState, useEffect } from "react"
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
import { toast } from "sonner"
import { api } from "@/config/api"
import { Loader, PlusSquare} from "lucide-react"
import axios, { AxiosError } from "axios"

export function AdminForm() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [passwordRetype, setPasswordRetype] = useState("")
  const [disableSubmit, setDisableSubmit] = useState(true)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const validEmail = email.trim().length > 0 && email.includes("@")
    const passwordsMatch = password === passwordRetype && password.length >= 6
    setDisableSubmit(
      !name.trim() ||
      !username.trim() ||
      !validEmail ||
      !passwordsMatch
    )
  }, [name, username, email, password, passwordRetype])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== passwordRetype) {
      toast.error("Passwords do not match")
      return
    }

    setLoading(true)
    try {
      const res = await api.post("/admin/crud", {
        name,
        email,
        username,
        password,
      })

      if (res.status === 201 || res.status === 200) {
        toast.success("Admin created successfully")
        setName("")
        setEmail("")
        setUsername("")
        setPassword("")
        setPasswordRetype("")
        setOpen(false)
      } else {
        toast.error("Failed to create admin")
      }
    } catch (err){
        if (axios.isAxiosError(err)) {
            const axiosError = err as AxiosError<{ message: string }>;
        
            if (axiosError.response?.data?.message) {
                toast.error(axiosError.response.data.message)
            } else {
                toast.error('An error occured. please try again')
            }
        }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
            <Button>
                <PlusSquare className="w-6 h-6 cursor-pointer" />
                Add admin
            </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Admin</DialogTitle>
            <DialogDescription>
              Create a new admin user by filling the fields below.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin123"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="passwordRetype">Retype Password *</Label>
              <Input
                id="passwordRetype"
                type="password"
                value={passwordRetype}
                onChange={(e) => setPasswordRetype(e.target.value)}
                placeholder="Retype password"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button" disabled={loading}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={disableSubmit || loading}>
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : "Add Admin"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
