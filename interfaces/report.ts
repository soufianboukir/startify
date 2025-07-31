import { Comment } from "./comment";
import { Idea } from "./idea";
import { User } from "./user";

export interface Report {
    _id: string
    count: number
    reportedUser?: User;
    reportedComment?: Comment;
    reportedIdea?: Idea;
    reason: string;
    reportedBy: User;
    createdAt?: Date;
    updatedAt?: Date;
}