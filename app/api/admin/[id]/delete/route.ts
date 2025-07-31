import { dbConnection } from "@/config/db"
import { authOptions } from "@/lib/auth"
import User from "@/models/user"
import { Types } from "mongoose"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) {
      try {
          const session = await getServerSession(authOptions)
          
          if (!session || session.user?.role !== 'admin') {
              return NextResponse.json({ message: 'Unauthorized' }, {status: 401})
          }
          await dbConnection()
          const { id } = await params
  
          if (!Types.ObjectId.isValid(id)) {
              return NextResponse.json({ message: 'Invalid admin ID' }, { status: 400 })
          }
  
          const deleted = await User.findOneAndDelete({ _id: id, role: 'admin' })
  
          if (!deleted) {
              return NextResponse.json({ message: 'Admin not found' }, { status: 404 })
          }
  
          return NextResponse.json({ message: 'Admin deleted successfully' }, { status: 200 })
      } catch (error) {
          console.error('Delete admin error:', error)
          return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
      }
  }
  