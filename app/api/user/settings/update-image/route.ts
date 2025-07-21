import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import User from '@/models/user'
import cloudinary from '@/lib/cloudinary'



export async function PUT(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const formData = await req.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'profile-images' },
            (error, result) => {
            if (error) reject(error)
                else resolve(result)
            }
        )
        stream.end(buffer)
        })

        const { secure_url } = result as { secure_url: string }

        const user = await User.findOneAndUpdate(
            { email: session.user.email },
            { $set: { image: secure_url } },
            { new: true }
        )

        return NextResponse.json({ message: 'Image updated', image: secure_url, user })
    } catch (error) {
        console.error('Image upload error:', error)
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }
}
