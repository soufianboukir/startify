import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import mongoose from 'mongoose';
import { authOptions } from '@/lib/auth';
import Report from '@/models/report';
import { dbConnection } from '@/config/db';

type ReportData = {
    reason: string
    reportedBy: string
    reportedUser?: string
    reportedComment?: string
    reportedIdea?: string
}


export async function POST(req: NextRequest) {
  try {
    await dbConnection();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { reason, userId, commentId, ideaId } = body;

    
    if (!reason || typeof reason !== 'string') {
        return NextResponse.json({ message: 'Reason is required' }, { status: 400 });
    }

    const ids = [userId, commentId, ideaId].filter(Boolean);
    
    if (ids.length !== 1) {
        return NextResponse.json({
            message: 'Exactly one of userId, commentId, or ideaId must be provided',
        }, { status: 400 });
    }

    const targetId = userId || commentId || ideaId;
    
    if (!mongoose.Types.ObjectId.isValid(targetId)) {
        return NextResponse.json({ message: 'Invalid ID format' }, { status: 400 });
    }



    const reportData: ReportData = {
        reason,
        reportedBy: session.user.id,
    };

    if (userId) reportData.reportedUser = userId;
    if (commentId) reportData.reportedComment = commentId;
    if (ideaId) reportData.reportedIdea = ideaId;    

    const report = await Report.create(reportData);

    return NextResponse.json({ message: 'Report submitted successfully', report });

  } catch (error) {
    console.error('POST /api/reports error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
