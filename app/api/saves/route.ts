import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnection } from '@/config/db';
import Save from '@/models/save';

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

        const [saves, total] = await Promise.all([
            Save.find({ user: userId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate({
                path: 'idea',
                populate: { path: 'author', select: 'name image username' }
                }),
            Save.countDocuments({ user: userId }),
        ]);

        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({ saves, totalPages }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to fetch saved ideas', error }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnection();

        const session = await getServerSession(authOptions);
        const userId = session?.user?.id;

        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { ideaId } = await req.json();

        if (!ideaId) {
            return NextResponse.json({ message: 'ideaId is required' }, { status: 400 });
        }

        const existing = await Save.findOne({ user: userId, idea: ideaId });

        if (existing) {
            await Save.deleteOne({ _id: existing._id });
            return NextResponse.json({ message: 'Idea unsaved', status: 'unsaved' }, { status: 200 });
        } else {
            const newSave = new Save({ user: userId, idea: ideaId });
            await newSave.save();
            return NextResponse.json({ message: 'Idea saved', status: 'saved' }, { status: 200 });
        }

    } catch (error) {
        return NextResponse.json({ message: 'Failed to toggle save', error }, { status: 500 });
    }
}
