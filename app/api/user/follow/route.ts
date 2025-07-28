
import { NextRequest, NextResponse } from 'next/server';
import Follower from '@/models/follower';
import { dbConnection } from '@/config/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Notification from '@/models/notification';
import User from '@/models/user';

export async function POST(req: NextRequest) {

    const session = await getServerSession(authOptions)
    if(!session || !session.user.id){
        return NextResponse.json({message : "Unauthorized"},{ status: 401})
    }
    const followerId = session.user.id

    await dbConnection();
    const { followingId } = await req.json();

    if (!followerId || !followingId || followerId === followingId) {
        return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const user = await User.findById(followerId)
    if(!user){
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    try {
        const existingFollow = await Follower.findOne({
            followerUser: followerId,
            followingUser: followingId,
        });

        if (existingFollow) {
            await Follower.deleteOne({ _id: existingFollow._id });
            return NextResponse.json({ status: 'unfollowed' });
        } else {
            await Follower.create({
                followerUser: followerId,
                followingUser: followingId,
            });
            await Notification.create({
                content: `Started following you`,
                fromUser: followerId,
                type: 'Follow',
                toUser: followingId,
                link: `${process.env.NEXT_PUBLIC_APP_URL}/${user.username}`,
            });
            return NextResponse.json({ status: 'followed' });
        }
    } catch{
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
