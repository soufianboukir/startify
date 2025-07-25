import { NextRequest, NextResponse } from 'next/server'
import Comment from '@/models/comment'
import { Types } from 'mongoose'
import { dbConnection } from '@/config/db'

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnection()

        const { id } = await params

        if (!Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid comment ID' }, { status: 400 })
        }

        const deletedComment = await Comment.findByIdAndDelete(id)
        if (!deletedComment) {
            return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
        }

        await Comment.deleteMany({ parent: id })

        return NextResponse.json({ message: 'Comment and its replies deleted' }, { status: 200 })
    } catch (error) {
        console.error('Delete comment error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
