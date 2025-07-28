import { User } from "./user"

export interface Follower {
    _id: string
    followerUser?: User
    followingUser?: User
    createdAt?: Date
    updatedAt?: Date
}