import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"
import { dbConnection } from "@/config/db";
import User from "@/models/user";
import PasswordResetToken from "@/models/passwordResetToken";

export async function POST(req: Request) {
    try {
        await dbConnection();

        
        const { email, token, password, confirmPassword } = await req.json();        
        

        if (!email || !token || !password || !confirmPassword) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        if (password !== confirmPassword) {
            return NextResponse.json({ message: "Passwords do not match" }, { status: 400 });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const resetTokenDoc = await PasswordResetToken.findOne({ email });
        if (!resetTokenDoc) {
            return NextResponse.json({ message: "Invalid or expired reset token" }, { status: 400 });
        }

        const isValid = resetTokenDoc.token === token;
        const isExpired = resetTokenDoc.expiresAt < new Date();

        if (!isValid || isExpired) {
            return NextResponse.json({ message: "Invalid or expired reset token" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        user.password = hashedPassword;
        await user.save();

        await PasswordResetToken.deleteOne({ _id: resetTokenDoc._id });

        return NextResponse.json({ message: "Password has been reset successfully" }, { status: 200 });

    } catch (error) {
        console.error("Error resetting password:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
