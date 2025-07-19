import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import User from "@/models/user"
import { dbConnection } from "@/config/db"
import bcrypt from 'bcryptjs'
import { JWT } from "next-auth/jwt"
import { Session } from "next-auth"
import { sendWelcomeEmail } from "@/lib/mail"
import { type NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),

        CredentialsProvider({
            name: "Credentials",
            credentials: {
              email: { label: "Email", type: "text" },
              password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const { email, password } = credentials ?? {}
                if (!email || !password) {
                    throw new Error("Invalid-credentials")
                }
            
                await dbConnection()
                const user = await User.findOne({ email })
            
                if (!user || !user.password) return null
            
                const isValid = await bcrypt.compare(password, user.password)
                if (!isValid) {
                    throw new Error("Invalid-credentials")
                }
            
                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    role: user.role,
                    username: user.username
                }
            },
        }),
    ],

    pages: {
        signIn: "/login",
        error: "/login"
    },

    session: {
        strategy: "jwt",
    },

    callbacks: {
        async signIn({ user }) {
            await dbConnection();
        
            let dbUser = await User.findOne({ email: user.email });
            
            if (!dbUser) {
                dbUser = await User.create({
                    name: user.name,
                    email: user.email,
                    username: user.email?.split("@")[0],
                    image: user.image,
                    role: 'user',
                });
        
                await sendWelcomeEmail({ to: user.email!, name: user.name! });
            }
        
            user.id = dbUser._id.toString();
            user.role = dbUser.role;
            user.username = dbUser.username;
        
            return true;
        },
        async jwt({ token, user })  {
            if (user) {
                token.id = user.id
                token.name = user.name
                token.email = user.email
                token.image = user.image
                token.role = user.role
                token.username = user.username
            }
            return token
          },
          
        async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
            if (token && session.user) {
                session.user.id = token.id
                session.user.name = token.name
                session.user.email = token.email
                session.user.image = token.image
                session.user.role = token.role
                session.user.username = token.username
            }
            return session
        }          
    },

    secret: process.env.NEXTAUTH_SECRET,
}