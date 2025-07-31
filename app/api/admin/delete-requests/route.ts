import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { dbConnection } from '@/config/db'
import DeleteRequest from '@/models/deleteRequest'

export async function GET() {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    await dbConnection()

    try {
        const requests = await DeleteRequest.find()
            .populate('user', 'username email')
            .sort({ createdAt: -1 })

        return NextResponse.json({ data: requests }, { status: 200 })
    } catch {
        return NextResponse.json({ message: 'Failed to fetch requests' }, { status: 500 })
    }
}
