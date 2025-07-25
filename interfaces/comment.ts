import { Idea } from "./idea"
import { User } from "./user"

export interface Comment {
    _id?: string
    content: string
    author: User
    idea?: Idea
    parent?: Comment
    likes?: User[]
    createdAt: Date
    updatedAt?: Date
}