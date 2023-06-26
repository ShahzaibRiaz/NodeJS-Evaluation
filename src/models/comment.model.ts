import mongoose, { Schema, Document } from 'mongoose';

// Comment subdocument schema
export interface IComment extends Document {
  userId: Schema.Types.ObjectId;
  blogId : Schema.Types.ObjectId;
  comment: string;
}

const CommentSchema: Schema<IComment> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide userId.'],
    },
    blogId: {
      type: Schema.Types.ObjectId,
      ref: 'Blog',
      required: [true, 'Please provide blogId.'],
    },
    comment: {
      type: String,
      required: [true, 'Please provide content for comment.'],
    },
  },
  { timestamps: true }
);

const CommentModel = mongoose.model<IComment>('Comment', CommentSchema);

export { CommentModel as Comment, CommentSchema };
