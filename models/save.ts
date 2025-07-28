import mongoose, { Schema, Document, model, Types } from "mongoose"

export interface ISave extends Document {
    user: Types.ObjectId
    idea: Types.ObjectId
    createdAt: Date
    updatedAt: Date
}

const saveSchema = new Schema<ISave>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        idea: { type: Schema.Types.ObjectId, ref: "Idea", required: true },
    },
    {
        timestamps: true,
    }
)

const Save = mongoose.models.Save || model<ISave>("Save", saveSchema)
export default Save
