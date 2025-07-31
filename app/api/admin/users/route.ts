import { dbConnection } from '@/config/db'
import { authOptions } from '@/lib/auth'
import User from '@/models/user'
import { getServerSession } from 'next-auth/next'
import { NextRequest, NextResponse } from 'next/server'
export async function GET(req: NextRequest) {

    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized' }, {status: 401})
    }

    await dbConnection()
    try {
        const { searchParams } = new URL(req.url)
        const page = parseInt(searchParams.get('page') || '1', 10)
        const limit = 10
        const skip = (page - 1) * limit

        const users = await User.find({ role: 'user' })
        .select('name username image headLine email createdAt')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })

        const totalUsers = await User.countDocuments({ role: 'user' })

        return NextResponse.json({
            page,
            totalPages: Math.ceil(totalUsers / limit),
            totalUsers,
            users,
        })
    } catch (error) {
        console.error('Error fetching users:', error)
        NextResponse.json({ message: 'Server error' }, { status: 500})
    }
}
