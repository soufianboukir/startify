import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnection } from '@/config/db';
import User from '@/models/user';

export async function GET(req: Request) {
    await dbConnection();

    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('query')?.trim() || '';

    const query = search
        ? {
            $and: [
                { role: { $ne: 'admin' } },
                {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { username: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                ],
                },
            ],
            }
        : { role: { $ne: 'admin' } };


    try {
        const users = await User.find(query).limit(10);
        return NextResponse.json({users}, { status: 200 });
    } catch {
        return NextResponse.json({ message: 'Failed to fetch users' }, { status: 500 });
    }
}
