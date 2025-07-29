import { User } from "./user"

export interface Follower {
    _id: string
    followerUser?: User
    followingUser?: string
    createdAt?: Date
    updatedAt?: Date
}

export interface Following {
    _id: string
    followerUser?: string
    followingUser?: User
    createdAt?: Date
    updatedAt?: Date
}