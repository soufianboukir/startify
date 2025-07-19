import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
    name?: string
    username: string
    email: string
    image?: string
    password?: string 
    role: 'user' | 'admin'
    createdAt: Date
    updatedAt: Date
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String },
        email: { type: String, required: true, unique: true },
        username: { type: String, required: true, unique: true },
        image: { type: String },
        password: { type: String },
        role: { type: String, enum: ['user', 'admin'], default: 'user' },
    },
    {
        timestamps: true,
    }
)


const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;