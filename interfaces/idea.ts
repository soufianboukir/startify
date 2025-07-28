import { User } from "./user"

export interface Idea {
    _id: string;
    title: string
    description: string
    problem: string
    tags: string[]
    author: User
    isOpenToCollab: boolean
    category: string
    upVotes: string[]
    downVotes: string[]
    createdAt: Date
    updatedAt: Date
}
