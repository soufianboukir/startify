import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Comment from '@/models/comment'
import { dbConnection } from '@/config/db'
import mongoose from 'mongoose'

export async function POST(req: NextRequest) {
    try {
        await dbConnection()

        const session = await getServerSession(authOptions)
        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const { content, ideaId, commentId } = body

        if (!content || !ideaId) {
            return NextResponse.json({ message: 'Missing content or ideaId' }, { status: 400 })
        }

        if (!mongoose.Types.ObjectId.isValid(ideaId)) {
            return NextResponse.json({ message: 'Invalid ideaId' }, { status: 400 })
        }

        if (commentId && !mongoose.Types.ObjectId.isValid(commentId)) {
            return NextResponse.json({ message: 'Invalid commentId' }, { status: 400 })
        }

        const newComment = await Comment.create({
                content,
                author: session.user.id,
                idea: ideaId,
                parent: commentId || null,
        })

        return NextResponse.json({ message: 'Comment posted', comment: newComment })
    } catch (error) {
        console.error('POST /api/comments error:', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}
