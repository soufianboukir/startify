import { NextRequest, NextResponse } from 'next/server'
import { dbConnection } from '@/config/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import User from '@/models/user'

export async function GET(req: NextRequest) {
  try {
    await dbConnection()
    const session = await getServerSession(authOptions)
    if(!session){
        return NextResponse.json({message: 'Unauthorized'},{ status:401})
    }

    const username = req.nextUrl.searchParams.get('username')
    if(username === session.user.username){
      return NextResponse.json({ error: "You can't message yourself" }, { status: 400 })
    }
    
    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 })
    }

    const user = await User.findOne({ username }, 'name username image')
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({user}, { status: 200 })
  } catch (error) {
    console.error('[USER_GET]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
