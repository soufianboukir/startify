"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader, Plus, X } from "lucide-react"
import { Switch } from "./ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { api } from "@/config/api"
import { toast } from "sonner"
import { Idea } from "@/interfaces/idea"

export function EditIdeaForm({ idea }: { idea: Idea }) {
  const [title, setTitle] = useState(idea.title)
  const [description, setDescription] = useState(idea.description)
  const [problem, setProblem] = useState(idea.problem)
  const [tags, setTags] = useState<string[]>(idea.tags || [])
  const [tagInput, setTagInput] = useState("")
  const [isOpenToCollab, setIsOpenToCollab] = useState(idea.isOpenToCollab)
  const [category, setCategory] = useState(idea.category)
  const [disableSubmit, setDisableSubmit] = useState(true)
  const [loading, setLoading] = useState(false)

  const addTag = () => {
    if (!tagInput.trim()) return
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
    const updatedIdea = {
      title,
      description,
      problem,
      tags,
      isOpenToCollab,
      category,
    }

    setLoading(true)
    try {
      const response = await api.put(`/ideas/${idea._id}`, { idea: updatedIdea })
      if (response.status === 200) {
        toast.success("Idea updated successfully")
      }
    } catch {
      toast.error("Failed to update idea")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setDisableSubmit(
      !title.trim() ||
      !description.trim() ||
      !problem.trim() ||
      tags.length === 0 ||
      !category.trim()
    )
  }, [title, description, problem, tags, category])

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div>
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="problem">Problem *</Label>
        <Textarea
          id="problem"
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          rows={3}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isOpenToCollab"
          checked={isOpenToCollab}
          onCheckedChange={() => setIsOpenToCollab(!isOpenToCollab)}
        />
        <Label htmlFor="isOpenToCollab">Is it open to collaboration</Label>
      </div>

      <div>
        <Label htmlFor="category">Category *</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {[
              "AI & Machine Learning", "Productivity", "Marketing",
              "Finance & Accounting", "HealthTech", "EdTech", "E-commerce",
              "Developer Tools", "HR & Recruiting", "Collaboration",
              "Project Management", "Data & Analytics", "Cybersecurity",
              "Real Estate", "LegalTech", "Social / Community",
              "Design & UX", "Content Creation", "Customer Support",
              "Travel & Hospitality"
            ].map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
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
            <div key={tag} className="flex items-center gap-1 bg-muted text-sm px-2 py-1 rounded-full">
              <span>{tag}</span>
              <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={disableSubmit || loading}>
          {loading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" /> Saving
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  )
}
