import { NextResponse } from "next/server"
import { sendPasswordResetEmail } from "@/lib/mail" 
import { generateResetToken } from "@/lib/utils"
import { addMinutes } from "date-fns"
import User from "@/models/user"
import PasswordResetToken from "@/models/passwordResetToken"
import { dbConnection } from "@/config/db"

export async function POST(req: Request) {
    try {
        const { email } = await req.json()

        if (!email) {
            return NextResponse.json({ message: "Email is required" }, { status: 400 })
        }

        await dbConnection()
        const user = await User.findOne({email})

        if (!user) {
            return NextResponse.json({ message: "If email exists in our system, a reset link was sent" })
        }

        const token = generateResetToken() 
        const expiresAt = addMinutes(new Date(), 5)

        await PasswordResetToken.create({
            email, 
            token,
            expiresAt
        })

        const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}&email=${email}`
        await sendPasswordResetEmail(email, resetLink)

        return NextResponse.json({ message: "Password reset link sent" })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ message: "Server error" }, { status: 500 })
    }
}
