import { Message } from "./message";
import { User } from "./user";

export interface Conversation extends Document {
  _id: string
  participants: User[];
  lastMessage?: Message;
  updatedAt: Date;
  createdAt: Date;
}
