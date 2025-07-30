import { dbConnection } from "@/config/db"
import { authOptions } from "@/lib/auth"
import { pusherServer } from "@/lib/pusher"
import Conversation from "@/models/conversation"
import Message from "@/models/message"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"



export async function POST(req: NextRequest) {
  try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const { conversationId, text } = await req.json()
        const senderId = session.user.id

        if (!conversationId || !text?.trim()) {
            return NextResponse.json({ message: 'Missing data' }, { status: 400 })
        }

        await dbConnection()

        const newMessage = await Message.create({
            conversation: conversationId,
            sender: senderId,
            text,
            seen: false,
        })

        await Conversation.findByIdAndUpdate(conversationId, {
            lastMessage: newMessage._id,
            updatedAt: new Date(),
        })

        const populatedMessage = await newMessage.populate('sender', 'name username image')

        await pusherServer.trigger(`conversation-${conversationId}`, 'new-message', {
            message: populatedMessage,
            conversationId
        })

        return NextResponse.json({ message: 'Message sent', data: populatedMessage })

    } catch (err) {
        console.error('[MESSAGE_POST]', err)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}