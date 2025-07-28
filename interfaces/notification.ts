import { User } from "./user"

export interface Notification {
    _id: string;
    fromUser?: User
    toUser?: User
    type: 'Comment' | 'Vote' | 'Comment liked' | 'Follow'
    link?: string
    content: string
    seen: boolean
    createdAt: Date
    updatedAt: Date
}