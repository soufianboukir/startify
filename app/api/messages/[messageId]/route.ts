import { NextRequest, NextResponse } from 'next/server'
import { dbConnection } from '@/config/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Message from '@/models/message'

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ messageId: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const userId = session.user.id
        const { messageId } = await params

        console.log(messageId);
        
        await dbConnection()

        const message = await Message.findById(messageId)

        if (!message) {
            return NextResponse.json({ message: 'Message not found' }, { status: 404 })
        }

        if (message.sender.toString() !== userId) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
        }

        await Message.findByIdAndDelete(messageId)

        return NextResponse.json({ message: 'Message deleted successfully' })
    } catch (err){
        console.log(err);
        
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}