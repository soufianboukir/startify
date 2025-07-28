import { Idea } from "./idea"
import { User } from "./user"

export interface Save {
    _id: string
    user: User
    idea: Idea
    createdAt: Date
    updatedAt: Date
}