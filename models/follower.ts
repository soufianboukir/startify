import mongoose, { Schema, Document, model, Types } from "mongoose"

export interface IFollower extends Document {
  followerUser: Types.ObjectId
  followingUser: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const followerSchema = new Schema<IFollower>(
  {
    followerUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
    followingUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
)

followerSchema.index({ followerUser: 1, followingUser: 1 }, { unique: true })

const Follower = mongoose.models.Follower || model<IFollower>("Follower", followerSchema)
export default Follower
