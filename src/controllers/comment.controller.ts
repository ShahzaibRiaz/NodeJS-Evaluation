import { NextFunction, Request, Response } from "express";
import amqplib from 'amqplib';
import asyncHandler from "../utils/asyncWrapper";
import { Blog } from "../models/blog.model";
import { getToken, verifyAndDecodeToken } from "../utils/verifyToken";
import { AppError } from "../utils/appError";
import { Comment, IComment } from "../models/comment.model";

const queue = 'RabbitMQ_Queue';

const addComment = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

  const { comment: content, blogId } = req.body || {};
  const blog = await Blog.findOne({ _id: blogId });
  if (!blog) {
    return next(new AppError('Please provide valid blog id.', 400));
  }
  const token = getToken(req);

  const { id: userId } = verifyAndDecodeToken(token!);
  const commentDB = await Comment.create({ comment: content, blogId, userId });
  
  // find the blog by Id and update the comments array.
  await Blog.findByIdAndUpdate(blogId, { $push: { comments: commentDB._id } });

  // Once the comment added send message to RabbitMQ
  await sendEmailNotification(commentDB);

  res.status(201).json({
    status: "success",
    data: {
      comment: commentDB
    }
  });
});

async function sendEmailNotification(comment: IComment) {
  const connection = await amqplib.connect(process.env.RABBIT_MQ!);
  const channel = await connection.createChannel();

  // Send dummy message to RabbitMQ (Cloud)
  channel.sendToQueue(queue, Buffer.from(comment.comment));

  // Close the channel and connection to prevent memory leakage.
  await channel.close();
  await connection.close();
}


export { addComment };

