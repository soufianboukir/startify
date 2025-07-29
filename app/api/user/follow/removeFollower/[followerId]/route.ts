import { dbConnection } from "@/config/db";
import { authOptions } from "@/lib/auth";
import Follower from "@/models/follower";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ followerId: string }> }) {
    try {

        const session = await getServerSession(authOptions)
        if(!session || !session.user.id){
            return NextResponse.json({message : "Unauthorized"},{ status: 401})
        }
        const followingId = session.user.id

        const { followerId } = await params;

        if (!followerId || !followingId) {
            return NextResponse.json({ error: 'Missing followerId or followingId' }, { status: 400 });
        }
        dbConnection()
        
        const deleted = await Follower.findOneAndDelete({
            followerUser: followerId,
            followingUser: followingId,
        });

        if (!deleted) {
            return NextResponse.json({ error: 'Follow relationship not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Follower removed successfully' }, { status: 200 });
    } catch {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
