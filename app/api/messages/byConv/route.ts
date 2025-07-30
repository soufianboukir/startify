import { NextRequest, NextResponse } from 'next/server'
import { dbConnection } from '@/config/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Message from '@/models/message'

export async function GET(
    req: NextRequest,
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }
        
        const { searchParams } = new URL(req.url)
        const conversationId = searchParams.get('conversationId')?.trim()

        
        await dbConnection()

        const messages = await Message.find({ conversation: conversationId })
                            .sort({ createdAt: 1 })
                            .populate({
                                path: 'sender',
                                select: 'name username avatarUrl',
                            })

        return NextResponse.json({ messages })
    } catch (error) {
        console.error('[GET_MESSAGES]', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}