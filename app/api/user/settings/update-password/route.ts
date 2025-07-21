import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import User from '@/models/user'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { oldPassword, password, r_password } = await req.json()

    if (!oldPassword || !password || !r_password) {
        return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    if (password !== r_password) {
        return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 })
    }

    const user = await User.findOne({ _id: session.user.id })
    if (!user || !user.password) {
        return NextResponse.json({ error: 'User not found or password not set' }, { status: 404 })
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password)
    if (!isMatch) {
        return NextResponse.json({ error: 'Old password is incorrect' }, { status: 400 })
    }

    const hashed = await bcrypt.hash(password, 12)

    user.password = hashed
    await user.save()

    return NextResponse.json({ message: 'Password updated successfully' })
    } catch (err) {
        console.error('Password update error:', err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
