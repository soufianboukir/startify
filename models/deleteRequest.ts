import mongoose, { Document, Schema, Types } from 'mongoose'

export interface IDeleteRequest extends Document {
    user: Types.ObjectId
    reason: string
    createdAt: Date
}

const DeleteRequestSchema = new Schema<IDeleteRequest>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        reason: { type: String, required: true },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
)

const DeleteRequest = mongoose.models.DeleteRequest || mongoose.model<IDeleteRequest>('DeleteRequest', DeleteRequestSchema)
export default DeleteRequest
