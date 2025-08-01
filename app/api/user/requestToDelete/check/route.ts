import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { dbConnection } from '@/config/db'
import DeleteRequest from '@/models/deleteRequest'

export async function GET() {
    const session = await getServerSession(authOptions)

    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    await dbConnection()

    const existingRequest = await DeleteRequest.findOne({ user: session.user.id })

    if (existingRequest) {
        return NextResponse.json({ exists: true, request: existingRequest })
    }

    return NextResponse.json({ exists: false }, {status: 404})
}
