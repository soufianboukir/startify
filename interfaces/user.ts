export type User = {
    _id?: string;
    name: string;
    username: string;
    image: string;
    email?: string;
    headLine?: string
    bio?: string
    website?: string
    role?: 'admin' | 'user';
}