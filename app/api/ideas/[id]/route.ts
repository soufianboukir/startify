import { NextResponse } from 'next/server'
import Idea from '@/models/idea'
import Comment from '@/models/comment'
import Report from '@/models/report'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { dbConnection } from '@/config/db'
import { Types } from 'mongoose'

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user?.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        await dbConnection()
        const { id } = await params

        if (!Types.ObjectId.isValid(id)) {
            return NextResponse.json({ message: 'Invalid idea ID' }, { status: 400 })
        }

        const idea = await Idea.findById(id)
        if (!idea) {
            return NextResponse.json({ message: 'Idea not found' }, { status: 404 })
        }

        const isAdmin = session.user.role === 'admin'
        const isAuthor = idea.author.toString() === session.user.id

        if (!isAuthor && !isAdmin) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
        }

        await Idea.findByIdAndDelete(id)

        const deletedComments = await Comment.find({ idea: id })
        const commentIds = deletedComments.map(c => c._id)

        await Comment.deleteMany({ idea: id })

        await Report.deleteMany({
            $or: [
                { reportedIdea: id },
                { reportedComment: { $in: commentIds } },
            ]
        })

        return NextResponse.json({ message: 'Idea, related comments, and reports deleted' }, { status: 200 })

    } catch (error) {
        console.error('Delete idea error:', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}
