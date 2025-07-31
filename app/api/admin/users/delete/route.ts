
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { dbConnection } from '@/config/db'
import User from '@/models/user'
import Idea from '@/models/idea'
import Comment from '@/models/comment'
import Save from '@/models/save'
import Notification from '@/models/notification'

export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const userId = searchParams.get('id')

        if (!userId) {
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 })
        }

        await dbConnection()
        const deletedUser = await User.findByIdAndDelete(userId)

        if (!deletedUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 })
        }

        await Idea.deleteMany({ author: userId });
        await Comment.deleteMany({ author: userId });
        await Save.deleteMany({ user: userId });
        await Notification.deleteMany({
          $or: [{ fromUser: userId }, { toUser: userId }],
        });

        await Idea.updateMany({}, { $pull: { upVotes: userId, downVotes: userId } });
        await Comment.updateMany({}, { $pull: { likes: userId } });

        return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: 'Server error', error }, { status: 500 })
    }
}
