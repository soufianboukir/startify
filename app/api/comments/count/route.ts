import { NextRequest, NextResponse } from 'next/server'
import { dbConnection } from '@/config/db'
import Comment from '@/models/comment'

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const ideaId = searchParams.get('ideaId')

    if (!ideaId) {
        return NextResponse.json({ error: 'ideaId is required' }, { status: 400 })
    }

    await dbConnection()

    const count = await Comment.countDocuments({ idea: ideaId })

    return NextResponse.json({ count })
}
