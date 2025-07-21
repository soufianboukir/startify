import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import User from '@/models/user'
import bcrypt from 'bcryptjs'
import { dbConnection } from '@/config/db'

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.email) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { oldPassword, password, r_password } = await req.json()

    if (!oldPassword || !password || !r_password) {
        return NextResponse.json({ message: 'All fields are required' }, { status: 400 })
    }

    if (password !== r_password) {
        return NextResponse.json({ message: 'Passwords do not match' }, { status: 400 })
    }

    await dbConnection()
    const user = await User.findOne({ _id: session.user.id })
    if (!user || !user.password) {
        return NextResponse.json({ message: 'Please reset your password during sign in' }, { status: 404 })
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password)
    if (!isMatch) {
        return NextResponse.json({ message: 'Old password is incorrect' }, { status: 400 })
    }

    const hashed = await bcrypt.hash(password, 12)

    user.password = hashed
    await user.save()

    return NextResponse.json({ message: 'Password updated successfully' })
    } catch (err) {
        console.error('Password update error:', err)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
