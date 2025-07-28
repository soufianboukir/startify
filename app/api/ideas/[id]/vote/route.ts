import { NextRequest, NextResponse } from 'next/server';
import mongoose, { isValidObjectId } from 'mongoose';
import Idea from '@/models/idea';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnection } from '@/config/db';
import Notification from '@/models/notification';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        if (!isValidObjectId(id)) {
            return NextResponse.json({ message: 'Invalid idea ID' }, { status: 400 });
        }

        const session = await getServerSession(authOptions);
        const userId = session?.user?.id;

        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { type } = await req.json();
        if (!['upvote', 'downvote'].includes(type)) {
            return NextResponse.json({ message: 'Invalid vote type' }, { status: 400 });
        }

        await dbConnection();
        const idea = await Idea.findById(id);
        if (!idea) {
            return NextResponse.json({ message: 'Idea not found' }, { status: 404 });
        }

        const userObjectId = new mongoose.Types.ObjectId(userId);

        const upVoteIds = idea.upVotes?.map((v: mongoose.Types.ObjectId) => v.toString()) || [];
        const downVoteIds = idea.downVotes?.map((v: mongoose.Types.ObjectId) => v.toString()) || [];

        if (type === 'upvote') {
            if (upVoteIds.includes(userId)) {
                idea.upVotes = idea.upVotes.filter((v: mongoose.Types.ObjectId) => v.toString() !== userId);
            } else {
                idea.downVotes = idea.downVotes.filter((v: mongoose.Types.ObjectId) => v.toString() !== userId);
                if (session.user.id !== idea.author.toString()){
                    await Notification.create({
                        type: 'Vote',
                        fromUser: session.user.id,
                        toUser: idea.author,
                        content: `${session.user.name} voted to your idea`,
                        link: `${process.env.NEXT_PUBLIC_APP_URL}/idea/${idea._id}`
                    });
                }
                idea.upVotes.push(userObjectId);
            }
        } else if (type === 'downvote') {
            if (downVoteIds.includes(userId)) {
                idea.downVotes = idea.downVotes.filter((v: mongoose.Types.ObjectId) => v.toString() !== userId);
            } else {
                idea.upVotes = idea.upVotes.filter((v: mongoose.Types.ObjectId) => v.toString() !== userId);
                idea.downVotes.push(userObjectId);
            }
        }

        await idea.save();
        return NextResponse.json({ message: 'Vote updated successfully' }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: 'Failed to vote', error }, { status: 500 });
    }
}
