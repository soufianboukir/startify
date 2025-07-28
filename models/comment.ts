import mongoose, { Document, Schema, model, Types } from "mongoose";

export interface IComment extends Document {
  content: string;
  author: Types.ObjectId;
  idea: Types.ObjectId;
  likes?: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    content: { type: String, required: true, trim: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    idea: { type: Schema.Types.ObjectId, ref: 'Idea', required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
  },
  { timestamps: true }
);

const Comment = mongoose.models.Comment || model<IComment>('Comment', commentSchema);
export default Comment;
