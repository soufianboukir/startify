import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IReport extends Document {
    reportedUser?: Types.ObjectId;
    reportedComment?: Types.ObjectId;
    reportedIdea?: Types.ObjectId;
    reason: string;
    reportedBy: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const ReportSchema = new Schema<IReport>(
    {
        reportedUser: { type: Types.ObjectId,ref: 'User',},
        reportedComment: { type: Schema.Types.ObjectId, ref: 'Comment' },
        reportedIdea: { type: Schema.Types.ObjectId, ref: 'Idea' },
        reason: { type: String, required: true, trim: true},
        reportedBy: { type: Schema.Types.ObjectId, ref: 'User', require: true },
    },
    { timestamps: true }
);



const Report = mongoose.models.Report || mongoose.model<IReport>('Report', ReportSchema);
export default Report;
