import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnection } from '@/config/db';
import Notification from '@/models/notification';

export async function GET(req: NextRequest) {
    try {
        await dbConnection();

        const session = await getServerSession(authOptions);
        const userId = session?.user?.id;

        if (!userId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const pageParam = searchParams.get('page');
        const page = pageParam ? parseInt(pageParam) : 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const [notifications, total] = await Promise.all([
            Notification.find({ toUser: userId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('fromUser', 'name image username')
                .populate('toUser', 'name image'),
            Notification.countDocuments({ toUser: userId })
        ]);

        const totalPages = Math.ceil(total / limit);
        return NextResponse.json({ notifications, totalPages }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to fetch notifications', error }, { status: 500 });
    }
}


export async function POST() {
    try {
        await dbConnection();
    
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id;
    
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
    
        await Notification.updateMany({ toUser: userId, seen: false }, { seen: true });
    
        return NextResponse.json({ message: 'All notifications marked as read' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to mark notifications as read', error }, { status: 500 });
    }
}
  