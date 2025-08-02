import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: Request) {
    const { email, message } = await req.json()

    if (!email || !message) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    })

    try {
        await transporter.sendMail({
            from: email,
            to: process.env.SMTP_USER,
            subject: 'New message from Startify contact form',
            text: `From: ${email}, Message:`+message,
        })

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
    }
}
