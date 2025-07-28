import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import mongoose from 'mongoose';
import { authOptions } from '@/lib/auth';
import Comment from '@/models/comment';
import { dbConnection } from '@/config/db';
import Notification from '@/models/notification';
import Idea from '@/models/idea';
import { Idea as IdeaInterface } from '@/interfaces/idea';

export async function PATCH(req: NextRequest) {
  try {
    await dbConnection();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { commentId } = await req.json();

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return NextResponse.json({ message: 'Invalid comment ID' }, { status: 400 });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return NextResponse.json({ message: 'Comment not found' }, { status: 404 });
    }

    const hasLiked = comment.likes?.includes(session.user.id)
    
    if (hasLiked) {
      comment.likes = comment.likes!.filter((id: string) => id.toString() !== session.user.id);
    } else {
      if( session.user.id !== comment.author.toString()){
        const idea:IdeaInterface | null = await Idea.findOne({_id: comment.idea})

        if(!idea){
          return NextResponse.json({message:"Idea was not found", status: 404})
        }

        await Notification.create({
          type: 'Comment liked',
          fromUser: session.user.id,
          toUser: comment.author._id,
          content: `${session.user.name} liked your comment`,
          link: `${process.env.NEXT_PUBLIC_APP_URL}/idea/${idea._id}`
        });
      }
      comment.likes!.push(session.user.id);
    }

    await comment.save();

    return NextResponse.json({
      message: hasLiked ? 'Comment unliked' : 'Comment liked',
      likesCount: comment.likes?.length ?? 0,
    });

  } catch (error) {
    console.error('PATCH /api/comments/[commentId]/like error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
