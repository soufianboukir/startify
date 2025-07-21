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

        const { website, headLine, bio } = await req.json()

        if (!website || !headLine || !bio) {
            return NextResponse.json({ error: 'Invalid attributes' }, { status: 400 })
        }

        const updatedUser = await User.findByIdAndUpdate(
            session.user.id,
            { website, headLine, bio },
            { new: true }
        )

        return NextResponse.json({ message: 'Data updated successfully', user: updatedUser })
    } catch (error) {
        console.error('Update data error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
