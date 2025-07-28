import { NextRequest, NextResponse } from 'next/server'
import Comment from '@/models/comment'
import { Types } from 'mongoose'
import { dbConnection } from '@/config/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnection()

        const session = await getServerSession(authOptions)
        if(!session){
            return NextResponse.json({
                'message': 'Unauthorized'
            },{ status: 401})
        }

        const { id } = await params

        if (!Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid comment ID' }, { status: 400 })
        }

        

        const deletedComment = await Comment.findOneAndDelete({
            author: session.user.id,
            _id: id,
        });
        if (!deletedComment) {
            return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
        }

        return NextResponse.json({ message: 'Comment deleted' }, { status: 200 })
    } catch (error) {
        console.error('Delete comment error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
