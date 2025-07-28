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

    if (!isValidObjectId(ideaId)) {
        return NextResponse.json({ message: 'Invalid idea ID' }, { status: 400 })
    }

    await dbConnection()

    const total = await Comment.countDocuments({ idea: ideaId })
    const allComments = await Comment.find({ idea: ideaId })
      .populate('author', 'username image name')
      .lean();

    allComments.sort((a, b) => {
      const aLikes = a.likes?.length || 0;
      const bLikes = b.likes?.length || 0;

      if (bLikes === aLikes) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }

      return bLikes - aLikes;
    });

    const paginated = allComments.slice((page - 1) * limit, page * limit);

    return NextResponse.json({comments: paginated, total}, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: 'Failed to fetch comments', error }, { status: 500 })
    }
}
