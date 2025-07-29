import { dbConnection } from '@/config/db';
import { authOptions } from '@/lib/auth';
import Follower from '@/models/follower';
import Idea from '@/models/idea';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  try {
    await dbConnection();
    
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const page = parseInt(req.nextUrl.searchParams.get('page') || '1');
    const limit = 10;
    const skip = (page - 1) * limit;

    const following = await Follower.find({ followerUser: userId }).select('followingUser');
    const followingIds = following.map(f => f.followingUser.toString());

    const ideas = await Idea.aggregate([
        {
            $addFields: {
            upVotesCount: { $size: { $ifNull: ['$upVotes', []] } },
            isFollowed: {
                $in: [
                '$author',
                followingIds.map(id => new mongoose.Types.ObjectId(id))
                ]
            },
            }
        },
        {
            $lookup: {
            from: 'users',
            localField: 'author',
            foreignField: '_id',
            as: 'authorInfo'
            }
        },
        {
            $unwind: '$authorInfo'
        },
        {
            $addFields: {
            author: {
                _id: '$authorInfo._id',
                name: '$authorInfo.name',
                username: '$authorInfo.username',
                image: '$authorInfo.image',
            }
            }
        },
        {
            $project: { authorInfo: 0 }
        },
        {
            $sort: {
            isFollowed: -1,
            upVotesCount: -1,
            createdAt: -1
            }
        },
        {
            $facet: {
            paginatedResults: [
                { $skip: skip },
                { $limit: limit }
            ],
            totalCount: [
                { $count: 'count' }
            ]
            }
        }
    ]);


    const results = ideas[0].paginatedResults;
    const totalCount = ideas[0].totalCount[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({ ideas: results, totalPages }, { status: 200 });

  } catch (err){
    console.log(err);
    
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
};
