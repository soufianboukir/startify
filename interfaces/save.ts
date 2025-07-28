import { Idea } from "./idea"
import { User } from "./user"

export interface Save {
    user: User
    idea: Idea
    createdAt: Date
    updatedAt: Date
}