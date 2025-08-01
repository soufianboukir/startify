import { User } from "./user"

export interface DeleteRequest {
    _id: string
    user: User
    reason: string
    createdAt: Date
}