import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { dbConnection } from '@/config/db'
import Follower from '@/models/follower'
import Idea from '@/models/idea'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const GET = async (req: NextRequest) => {
    try {
      await dbConnection()

      const pageParam = req.nextUrl.searchParams.get('page')
      const limitParam = req.nextUrl.searchParams.get('limit')

      const session = await getServerSession(authOptions)
      if( !session || !session.user.id ) {
        return NextResponse.json({message:"Unauthorized"},{status: 401})
      }
      const userId = session.user.id

      const page = parseInt(pageParam || '1')
      const limit = parseInt(limitParam || '2')
      const skip = (page - 1) * limit

      const following = await Follower.find({ followerUser: userId }).select('followingUser')
      const followingUserIds = following.map(f => f.followingUser.toString())

      const ideas = await Idea.aggregate([
        {
          $addFields: {
            upVoteCount: { $size: '$upVotes' },
            isFromFollowedUser: {
              $in: ['$author', followingUserIds.map(id => new mongoose.Types.ObjectId(id))]
            }
          }
        },
        {
          $addFields: {
            score: {
              $add: [
                '$upVoteCount',
                { $cond: [{ $eq: ['$isFromFollowedUser', true] }, 3, 0] }
              ]
            }
          }
        },
        { $sort: { score: -1, createdAt: -1 } },
        {
          $lookup: {
            from: 'users',
            localField: 'author',
            foreignField: '_id',
            as: 'author'
          }
        },
        {
          $unwind: '$author'
        },
        {
          $project: {
            title: 1,
            description: 1,
            problem: 1,
            tags: 1,
            isOpenToCollab: 1,
            category: 1,
            createdAt: 1,
            updatedAt: 1,
            upVotes: 1,
            downVotes: 1,
            score: 1,
            'author._id': 1,
            'author.name': 1,
            'author.username': 1,
            'author.image': 1,
          }
        },
        {
          $facet: {
            data: [{ $skip: skip }, { $limit: limit }],
            totalCount: [{ $count: 'count' }]
          }
        }
      ])

      const result = ideas[0]
      const totalItems = result.totalCount[0]?.count || 0
      const totalPages = Math.ceil(totalItems / limit)

      return NextResponse.json({
          ideas: result.data,
          page,
          totalPages,
      })
    } catch (error) {
      console.error('[FEED_MERGED_PAGINATED_ERROR]', error)
      return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
