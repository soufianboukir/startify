import { NextRequest, NextResponse } from 'next/server'
import User from '@/models/user'
import { dbConnection } from '@/config/db'
import bcrypt from 'bcryptjs'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
        const session = await getServerSession(authOptions)
    
        if (!session || session.user?.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, {status: 401})
        }
        await dbConnection()
        const admins = await User.find({ role: 'admin', _id:{ $ne: session.user.id}}).select('-password')
        return NextResponse.json({admins}, { status: 200 })
    } catch (error) {
        console.error('Get admins error:', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        
        if (!session || session.user?.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, {status: 401})
        }
        await dbConnection()
        const body = await req.json()
        const { name, username, email, password } = body

        if (!username || !email || !password) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
        }

        const existingUser = await User.findOne({
            $or: [{ email }, { username }],
        })
        if (existingUser) {
            return NextResponse.json({ message: 'Username or email already taken' }, { status: 409 })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newAdmin = new User({
            name,
            username,
            email,
            password: hashedPassword,
            role: 'admin',
        })

        await newAdmin.save()

        return NextResponse.json({ message: 'Admin created successfully' }, { status: 201 })
    } catch (error) {
        console.error('Create admin error:', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}
