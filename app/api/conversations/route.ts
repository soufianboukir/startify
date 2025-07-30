import { dbConnection } from '@/config/db'
import { authOptions } from '@/lib/auth'
import Conversation from '@/models/conversation'
import Message from '@/models/message'
import User from '@/models/user'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const userId = session.user.id
        await dbConnection()

        const conversations = await Conversation.find({
                        participants: userId,
                        })
                        .sort({ updatedAt: -1 })
                        .populate({
                            path: 'participants',
                            select: 'name username image',
                        })
                        .populate({
                            path: 'lastMessage',
                            model: Message,
                            populate: {
                                path: 'sender',
                                model: User,
                                select: 'name username image',
                            },
                        })
                        .exec()

        return NextResponse.json({ conversations })
    } catch (err) {
        console.error('[GET_CONVERSATIONS]', err)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const { recipientId, message } = await req.json()
        const currentUserId = session.user.id

        if (!recipientId || !message) {
            return NextResponse.json(
                { message: 'Recipient and message are required' },
                { status: 400 }
            )
        }

        await dbConnection()

        let conversation = await Conversation.findOne({
            participants: { $all: [currentUserId, recipientId], $size: 2 },
        })

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [currentUserId, recipientId],
            })
        }

        const newMessage = await Message.create({
            conversation: conversation._id,
            sender: currentUserId,
            text: message,
            seen: false,
        })

        conversation.lastMessage = newMessage._id
        await conversation.save()

        const populatedConversation = await Conversation.findById(conversation._id)
            .populate({
                path: 'participants',
                select: 'name username image',
            })
            .populate({
                path: 'lastMessage',
                populate: {
                    path: 'sender',
                    select: 'name username image',
                },
            })

        return NextResponse.json(
            { message: 'Conversation started', messageContent: newMessage, conversation: populatedConversation },
            { status: 200 }
        )
    } catch (error) {
        console.error('[START_CONVERSATION]', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}
