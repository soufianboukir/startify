export type User = {
    id : string;
    name: string;
    username: string;
    image: string;
    email: string;
    role: 'admin' | 'user';
}