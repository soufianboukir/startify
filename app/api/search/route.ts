import { NextResponse } from 'next/server'
import User from '@/models/user'
import Idea from '@/models/idea'
import { dbConnection } from '@/config/db'

export async function GET(req: Request) {

    const { searchParams } = new URL(req.url)
    const query = searchParams.get('query')?.trim()

    if (!query) {
        return NextResponse.json({ users: [], ideas: [] })
    }

    await dbConnection()

    const regex = new RegExp(query, 'i')
  
    const [users, ideas] = await Promise.all([
        User.find({
            $or: [
                { name: regex },
                { username: regex },
            ]
        }).select('name username image headLine')
            .limit(6),

        Idea.find({
            $or: [
                { title: regex },
                { description: regex },
                { problem: regex },
                { tags: { $in: [regex] } },
            ]
        }).populate('author', 'name username image')
        .limit(6)
    ])
  
    return NextResponse.json({ users, ideas })
}
