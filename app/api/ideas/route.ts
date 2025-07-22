import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Idea from "@/models/idea"
import { dbConnection } from "@/config/db"

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await dbConnection()
        const body = await req.json()

        const { title, description, problem, tags, isOpenToCollab, category } = body.idea
        
        if (!title || !description || !category || !problem || !Array.isArray(tags)) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            )
        }

        const newIdea = new Idea({
            title,
            description,
            problem,
            tags,
            category,
            isOpenToCollab,
            author: session.user.id,
        })

        await newIdea.save()

        return NextResponse.json({ message: "Idea created", idea: newIdea })
    } catch (err) {
        console.error("Failed to post idea:", err)
        return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
    }
