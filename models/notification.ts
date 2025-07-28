import mongoose, { Document, Schema, model, Types } from 'mongoose'

export interface INotification extends Document {
    fromUser?: Types.ObjectId
    toUser?: Types.ObjectId
    type: 'Comment' | 'Vote' | 'Comment liked'
    link?: string
    content: string
    seen: boolean
    createdAt: Date
    updatedAt: Date
}

const notificationSchema = new Schema<INotification>(
    {
        content: { type: String, required: true, trim: true },
        link: { type: String, required: false},
        type: {type: String, enum: ['Comment','Vote','Comment liked'], required: true},
        fromUser: { type: Schema.Types.ObjectId, ref: 'User' },
        toUser: { type: Schema.Types.ObjectId, ref: 'User' },
        seen: { type: Boolean, required: true, default: false },
    },
    { timestamps: true }
)

const Notification = mongoose.models.Notification || model<INotification>('Notification', notificationSchema)
export default Notification
