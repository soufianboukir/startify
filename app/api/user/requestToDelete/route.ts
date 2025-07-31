import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import DeleteRequest from '@/models/deleteRequest'
import { dbConnection } from '@/config/db'

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    await dbConnection()
    const { reason } = await req.json()

    if (!reason) {
        return NextResponse.json({ message: 'Reason is required' }, { status: 400 })
    }

    try {
        const newRequest = await DeleteRequest.create({
            user: session.user.id,
            reason,
        })

        return NextResponse.json({ message: 'Request submitted', data: newRequest })
    } catch {
        return NextResponse.json({ message: 'Failed to submit request' }, { status: 500 })
    }
}
