import { Conversation } from "./conversation";
import { User } from "./user";

export interface Message extends Document {
    _id: string
    conversation: Conversation;
    sender: User;
    text: string;
    seen: boolean;
    createdAt: Date;
    updatedAt: Date;
}