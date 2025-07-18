import mongoose, { Schema, Document } from "mongoose";

export interface IPasswordResetToken extends Document {
    email: string;
    token: string;
    expiresAt: Date;
    createdAt: Date;
}

const PasswordResetTokenSchema = new Schema<IPasswordResetToken>({
    email: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300,
    },
});


const PasswordResetToken = mongoose.models.PasswordResetToken || mongoose.model<IPasswordResetToken>("PasswordResetToken", PasswordResetTokenSchema);
export default PasswordResetToken;  