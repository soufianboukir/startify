import { authOptions } from '@/lib/auth'
import User from '@/models/user'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { username } = await req.json()

        if (!username || typeof username !== 'string') {
        return NextResponse.json({ error: 'Invalid username' }, { status: 400 })
        }

        const updatedUser = await User.findByIdAndUpdate(
            session.user.id,
            { username },
            { new: true }
        )

        return NextResponse.json({ message: 'Username updated successfully', user: updatedUser })
    } catch (error) {
        console.error('Update username error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
