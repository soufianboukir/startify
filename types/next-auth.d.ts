import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string
      username: string
      headLine: string
      bio?: string
      website?: string
    }
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string
    username: string
    headLine: string
    bio?: string
    website?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string
    username: string
    headLine: string
    bio?: string
    website?: string
  }
}
