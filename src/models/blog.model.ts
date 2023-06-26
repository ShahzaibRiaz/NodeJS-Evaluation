import mongoose, { Schema, Document } from 'mongoose';
import { CommentSchema, IComment } from "./comment.model";

export interface IBlog extends Document {
  userId: Schema.Types.ObjectId;
  title: string;
  content: string;
  comments: IComment[];
}

const BlogSchema: Schema<IBlog> = new Schema(
  {
    // Owner UserId of the Blog.
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      }
    ],
    // Refactor the comments because of better performance and prevent data duplication
    // comments: [CommentSchema],
  },
  { timestamps: true }
);

const BlogModel = mongoose.model<IBlog>('Blog', BlogSchema);

export { BlogModel as Blog };