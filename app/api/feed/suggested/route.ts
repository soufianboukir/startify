import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { dbConnection } from '@/config/db'
import Follower from '@/models/follower'
import Idea from '@/models/idea'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const GET = async () => {
  try {
    await dbConnection()

    
    const session = await getServerSession(authOptions)
    if(!session || !session.user.id){
        return NextResponse.json({message: 'Unauthorized'},{status: 401})
    }

    const userId = session.user.id
    const currentUserId = new mongoose.Types.ObjectId(userId)

    const followed = await Follower.find({ followerUser: currentUserId }).select('followingUser')
    const followedIds = followed.map(f => f.followingUser.toString())

    const suggestions = await Idea.aggregate([
        {
            $group: {
                _id: '$author',
                ideaCount: { $sum: 1 }
            }
        },
        {
            $match: {
            _id: {
                $nin: [...followedIds.map(id => new mongoose.Types.ObjectId(id)), currentUserId]
            }
            }
        },
        {
            $sort: { ideaCount: -1 }
        },
        {
            $limit: 6
        },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'user'
            }
        },
        {
            $unwind: '$user'
        },
        {
            $project: {
                _id: '$user._id',
                name: '$user.name',
                username: '$user.username',
                image: '$user.image',
                headLine: '$user.headLine',
                ideaCount: 1
            }
        }
    ])

    return NextResponse.json({ users: suggestions })
  } catch (error) {
    console.error('[SUGGESTED_USERS_ERROR]', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
