import { dbConnection } from '@/config/db'
import { authOptions } from '@/lib/auth'
import Report from '@/models/report'
import { getServerSession } from 'next-auth/next'
import { NextRequest, NextResponse } from 'next/server'
import '@/models/idea'
import '@/models/comment'
import '@/models/user'
export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    await dbConnection()

    try {
        const { searchParams } = new URL(req.url)
        const page = parseInt(searchParams.get('page') || '1', 10)
        const limit = 10
        const skip = (page - 1) * limit

        const reports = await Report.find({
            $or: [
                { reportedIdea: { $ne: null } },
                { reportedComment: { $ne: null } },
                { reportedUser: { $ne: null } },
            ]
        })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }) 
        .populate('reportedBy', 'name username')
        .populate('reportedUser', 'name username')
        .populate('reportedIdea', 'title')
        .populate('reportedComment', 'content')

        const totalReports = await Report.countDocuments({
            $or: [
                { reportedIdea: { $ne: null } },
                { reportedComment: { $ne: null } },
                { reportedUser: { $ne: null } },
            ]
        })

        const totalPages = Math.ceil(totalReports / limit)

        return NextResponse.json({
            page,
            totalPages,
            totalReports,
            reports
        })
    } catch (error) {
        console.error('Error fetching reports:', error)
        return NextResponse.json({ message: 'Server error' }, { status: 500 })
    }
}
