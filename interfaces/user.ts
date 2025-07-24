export interface User {
    _id: string
    name?: string
    username: string
    email: string
    image?: string
    password?: string 
    role: 'user' | 'admin'
    headLine?: string
    bio?: string
    website?: string
    createdAt: Date
    updatedAt: Date
}