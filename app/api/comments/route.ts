import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import mongoose from 'mongoose';
import { authOptions } from '@/lib/auth';
import Comment from '@/models/comment';
import Idea from '@/models/idea';
import Notification from '@/models/notification';
import { dbConnection } from '@/config/db';

export async function POST(req: NextRequest) {
    try {
        await dbConnection();

        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { content, ideaId } = body;

        if (!content || !ideaId) {
            return NextResponse.json({ message: 'Missing content or ideaId' }, { status: 400 });
        }

        if (!mongoose.Types.ObjectId.isValid(ideaId)) {
            return NextResponse.json({ message: 'Invalid ideaId' }, { status: 400 });
        }

        const idea = await Idea.findById(ideaId).populate('author', 'username');
        if (!idea) {
            return NextResponse.json({ message: 'Idea not found' }, { status: 404 });
        }

        const newComment = await Comment.create({
            content,
            author: session.user.id,
            idea: ideaId,
        });

        const populatedComment = await Comment.findById(newComment._id)
                                                .populate('author', 'username image');

        if (session.user.id !== idea.author._id.toString()) {
            await Notification.create({
                content: `Commented on your idea`,
                fromUser: session.user.id,
                type: 'Comment',
                toUser: idea.author._id,
                link: `${process.env.NEXT_PUBLIC_APP_URL}/idea/${idea._id}`,
            });
        }

        return NextResponse.json({ message: 'Comment posted', comment: populatedComment });

    } catch (error) {
        console.error('POST /api/comments error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
