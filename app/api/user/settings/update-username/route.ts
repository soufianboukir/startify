import { authOptions } from '@/lib/auth'
import User from '@/models/user'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
export async function PUT(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user?.email) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const { username } = await req.json()

        if (!username || typeof username !== 'string') {
            return NextResponse.json({ message: 'Invalid username' }, { status: 400 })
        }

        const usernameExists = await User.findOne({ _id: { $ne: session.user.id }, username })
        if(usernameExists){
            return NextResponse.json({ message: 'Username already exists' }, { status: 400 })
        }
        const updatedUser = await User.findByIdAndUpdate(
            session.user.id,
            { username },
            { new: true }
        )

        return NextResponse.json({ message: 'Username updated successfully', user: updatedUser })
    } catch (error) {
        console.error('Update username error:', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}
