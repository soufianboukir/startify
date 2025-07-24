import { NextResponse } from 'next/server'
import Idea from '@/models/idea' 
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { dbConnection } from '@/config/db'

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        await dbConnection()

        const idea = await Idea.findById(params.id)

        if (!idea) {
            return NextResponse.json({ message: 'Idea not found' }, { status: 404 })
        }

        if (idea.author.toString() !== session.user.id) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
        }

        await Idea.findByIdAndDelete(params.id)

        return NextResponse.json({ message: 'Idea deleted successfully' }, { status: 200 })
    } catch {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}
