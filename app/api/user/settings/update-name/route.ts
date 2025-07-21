import { authOptions } from '@/lib/auth'
import User from '@/models/user'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
export async function PUT(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { name } = await req.json()

        if (!name || typeof name !== 'string') {
        return NextResponse.json({ error: 'Invalid name' }, { status: 400 })
        }

        const updatedUser = await User.findByIdAndUpdate(
            session.user.id,
            { name },
            { new: true }
        )

        return NextResponse.json({ message: 'Name updated successfully', user: updatedUser })
    } catch (error) {
        console.error('Update name error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
