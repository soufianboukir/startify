import { NextResponse } from 'next/server'
import User from '@/models/user'
import Idea from '@/models/idea'
import { dbConnection } from '@/config/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: Request) {

    const session = await getServerSession(authOptions)

    if( !session){
        return NextResponse.json({message: "Unauthorized"}, { status: 500})
    }
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
        }).select('name username image headLine'),

        Idea.find({
        $or: [
            { title: regex },
            { description: regex },
            { problem: regex },
            { tags: { $elemMatch: regex } },
        ]
        }).populate('author', 'name username image')
    ])

    return NextResponse.json({ users, ideas })
}
