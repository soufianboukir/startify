"use client"

import { useEffect, useState } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { Edit, Loader, Plus, PlusSquare, X } from "lucide-react"
import { Switch } from "./ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { api } from "@/config/api"
import { toast } from "sonner"
import { Idea } from "@/interfaces/idea"

export function IdeaForm({ idea }: { idea?: Idea}) {
    

    console.log(idea);
    
    const [title, setTitle] = useState(idea?.title || "")
    const [description, setDescription] = useState(idea?.description || "")
    const [problem, setProblem] = useState(idea?.problem || "")
    const [tags, setTags] = useState<string[]>(idea?.tags || [])
    const [tagInput, setTagInput] = useState("")
    const [isOpenToCollab,setIsOpenToCollab] = useState(idea?.isOpenToCollab || false)
    const [category,setCategory] = useState(idea?.category || '')
    const [disableSubmit,setDisableSubmit] = useState(true)
    const [open,setOpen] = useState(false)
    const [loading,setLoading] = useState(false)

    const addTag = () => {
        if(!tagInput.trim()) return
        if (!tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()])
        }
        setTagInput("")
    }

    const removeTag = (tag: string) => {
        setTags(tags.filter((t) => t !== tag))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const ideaData = { title, description, problem, tags, isOpenToCollab, category }
        setLoading(true)
        try{
            if( idea?._id ){
                const response = await api.put(`/ideas`,{ideaData})
                if(response.status === 200){
                    toast.success("Your idea data has been updated")
                    setTitle('')
                    setDescription('')
                    setProblem('')
                    setTags([])
                    setCategory('')
                    setOpen(false)
                }
            }else{
                const response = await api.post(`/ideas`,{ideaData})
                if(response.status === 200){
                    toast.success("Your idea has been shared")
                    setTitle('')
                    setDescription('')
                    setProblem('')
                    setTags([])
                    setCategory('')
                    setOpen(false)
                }
            }
        }catch{
            toast.error("An error occured. try again")
        }finally{
            setLoading(false)
        }
    }

    // useEffect(() => {
    //     setDisableSubmit(
    //         !title.trim() ||
    //         !description.trim() ||
    //         !problem.trim() ||
    //         tags.length === 0 ||
    //         !category.trim()
    //     )
    // }, [title, description, problem, tags, category])
      

    return (
        <Dialog open={open} onOpenChange={() => setOpen(!open)}>
            <DialogTrigger asChild>
                {
                    idea?
                    <button className="flex items-center gap-2 px-2 py-1 cursor-pointer">
                        <Edit className="w-4 h-4" />
                        Edit
                    </button>
                    : <PlusSquare className="w-5 h-5 hidden md:block cursor-pointer" />
                }
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Share new idea</DialogTitle>
                        <DialogDescription>
                        Share your startup idea with others and find collaborators & real feedback.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title *</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="AI Resume Reviewer"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description *</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe your idea and how it works..."
                                rows={4}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="problem">Problem *</Label>
                            <Textarea
                                id="problem"
                                value={problem}
                                onChange={(e) => setProblem(e.target.value)}
                                placeholder="What problem does this idea solve?"
                                rows={3}
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch id="isOpenToCollab" checked={isOpenToCollab} onCheckedChange={() => setIsOpenToCollab(!isOpenToCollab)}/>
                            <Label htmlFor="isOpenToCollab">Is it open to collaboration</Label>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="category">Category *</Label>
                            <Select value={category} onValueChange={(value) => setCategory(value)}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="AI & Machine Learning">AI & Machine Learning</SelectItem>
                                    <SelectItem value="Productivity">Productivity</SelectItem>
                                    <SelectItem value="Marketing">Marketing</SelectItem>
                                    <SelectItem value="Finance & Accounting">Finance & Accounting</SelectItem>
                                    <SelectItem value="HealthTech">HealthTech</SelectItem>
                                    <SelectItem value="EdTech">EdTech</SelectItem>
                                    <SelectItem value="E-commerce">E-commerce</SelectItem>
                                    <SelectItem value="Developer Tools">Developer Tools</SelectItem>
                                    <SelectItem value="HR & Recruiting">HR & Recruiting</SelectItem>
                                    <SelectItem value="Collaboration">Collaboration</SelectItem>
                                    <SelectItem value="Project Management">Project Management</SelectItem>
                                    <SelectItem value="Data & Analytics">Data & Analytics</SelectItem>
                                    <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                                    <SelectItem value="Real Estate">Real Estate</SelectItem>
                                    <SelectItem value="LegalTech">LegalTech</SelectItem>
                                    <SelectItem value="Social / Community">Social / Community</SelectItem>
                                    <SelectItem value="Design & UX">Design & UX</SelectItem>
                                    <SelectItem value="Content Creation">Content Creation</SelectItem>
                                    <SelectItem value="Customer Support">Customer Support</SelectItem>
                                    <SelectItem value="Travel & Hospitality">Travel & Hospitality</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="tags">Tags *</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="tags"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    placeholder="Press plus to add a tag"
                                />
                                <Button onClick={addTag} type="button">
                                    <Plus />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {tags.map((tag) => (
                                    <div
                                        key={tag}
                                        className="flex items-center gap-1 bg-muted text-sm px-2 py-1 rounded-full"
                                    >
                                        <span>{tag}</span>
                                        <button
                                        type="button"
                                        onClick={() => removeTag(tag)}
                                        className="hover:text-red-500"
                                        >
                                        <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={disableSubmit || loading}>
                            {
                                loading?
                                    <><Loader className="w-4 h-4 animate-spin"/> posting</>
                                :
                                "Share Idea"
                            }
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
