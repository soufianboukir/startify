import { NextRequest, NextResponse } from 'next/server'
import { isValidObjectId } from 'mongoose'
import { dbConnection } from '@/config/db'
import Comment from '@/models/comment'

export async function GET(req: NextRequest, { params }: { params: Promise<{ ideaId: string }> }) {
    try {
    const {ideaId} = await params
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = 10
    const skip = (page - 1) * limit

    if (!isValidObjectId(ideaId)) {
        return NextResponse.json({ message: 'Invalid idea ID' }, { status: 400 })
    }

    await dbConnection()

    const total = await Comment.countDocuments({ idea: ideaId, parent: null })
    const comments = await Comment.find({ idea: ideaId, parent: null })
        .sort({ 'likes.length': -1 })
        .skip(skip)
        .limit(limit)
        .populate('author', 'name image username')
        .lean()

    return NextResponse.json({comments, total}, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: 'Failed to fetch comments', error }, { status: 500 })
    }
}
