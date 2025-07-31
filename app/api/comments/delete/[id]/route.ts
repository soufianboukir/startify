import { NextRequest, NextResponse } from 'next/server'
import Comment from '@/models/comment'
import Report from '@/models/report'
import { Types } from 'mongoose'
import { dbConnection } from '@/config/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnection()

        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params
        
        if (!Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid comment ID' }, { status: 400 })
        }

        let deletedComment

        if (session.user.role === 'admin') {
            deletedComment = await Comment.findOneAndDelete({ _id: id })
        } else {
            deletedComment = await Comment.findOneAndDelete({ _id: id, author: session.user.id })
        }

        if (!deletedComment) {
            return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
        }

        await Report.deleteMany({ reportedComment: id })

        return NextResponse.json({ message: 'Comment and associated reports deleted' }, { status: 200 })

    } catch (error) {
        console.error('Delete comment error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
