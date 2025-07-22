
import mongoose, { Schema, Document, model } from "mongoose"

export interface IIdea extends Document {
    title: string
    description: string
    problem: string
    tags: string[]
    author: mongoose.Types.ObjectId
    isOpenToCollab: boolean
    category: string
    createdAt: Date
    updatedAt: Date
}

const ideaSchema = new Schema<IIdea>(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        problem: { type: String, required: true },
        tags: { type: [String], default: [] },
        isOpenToCollab: {type: Boolean, required: true, default: false},
        category: { type: String, required: true },
        author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    {
        timestamps: true,
    }
)

const Idea = mongoose.models.Idea || model<IIdea>("Idea", ideaSchema)
export default Idea
