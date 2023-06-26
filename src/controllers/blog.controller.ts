import { NextFunction, Request, Response } from "express";
import asyncHandler from "../utils/asyncWrapper";
import { Blog } from "../models/blog.model";
import { getToken, verifyAndDecodeToken } from "../utils/verifyToken";
import { AppError } from "../utils/appError";
import { Comment } from "../models/comment.model";

const createBlog = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

  const { title, content } = req.body || {};
  const token = getToken(req);

  if (!token) {
    return next(new AppError('Invalid token, please login again to get access.', 401));
  }

  const { id } = verifyAndDecodeToken(token);
  const blog = await Blog.create({ title, content, userId: id });

  res.status(201).json({
    status: "success",
    data: {
      blog
    }
  });
});

const getBlogs = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement the pagination and sorting on Blogs (TASK)
  const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'asc' } = req.query;

  // Convert query parameters to numbers
  const pageNumber = parseInt(page as string);
  const limitNumber = parseInt(limit as string);

  // Calculate skip value based on page and limit
  const skip = (pageNumber - 1) * limitNumber;

  // Create sort object based on sortBy and sortOrder
  const sort: { [key: string]: 'asc' | 'desc' } = { [sortBy as string]: sortOrder as 'asc' | 'desc' };

  const blogs = await Blog.find()
  .select('-comments')
  .sort(sort)
  .skip(skip)
  .limit(limitNumber);

  res.status(200).json({
    status: "success",
    data: {
      blogs
    }
  });

});

const getBlog = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { blogId } = req.params;
  const blog = await Blog.findById(blogId).populate('comments');

  if(!blog) {
    return next(new AppError('Blog not found with given ID.', 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      blog
    }
  })

});

const deleteBlog = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // Check if userId inside token is same as for the blog owner (userId)
  const { blogId } = req.params || {};
  const token = getToken(req);
  const { id: userId } = verifyAndDecodeToken(token!);
  const blog = await Blog.findOne({ _id: blogId });

  if (!blog) {
    return next(new AppError('Invalid Blog ID.', 400));
  } 

  if (blog.userId.toString() !== userId) {
    return next(new AppError('You dont have access for this operation.', 403));
  }

  const deletedBlog = await Blog.findByIdAndDelete(blogId);
  await Comment.deleteMany({ _id: { $in: blog.comments } });

  res.status(200).json({
    status: "success",
    data: {
      blog: deletedBlog
    }
  });
});

const updateBlog = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { blogId, title = '', content } = req.body || {};
  const updateFields: { title?: string, content?: string } = {};
  
  if (title !== '') {
    updateFields.title = title;
  }
  if (content !== '') {
    updateFields.content = content;
  }
  
  const token = getToken(req);
  const { id: userId } = verifyAndDecodeToken(token!);
  const blog = await Blog.findOne({ _id: blogId });

  if (!blog) {
    return next(new AppError('Invalid blog ID.', 400));
  }

  if (blog.userId.toString() !== userId) {
    return next(new AppError('You dont have access for this operation.', 403));
  }

  const updatedBlog = await Blog.findOneAndUpdate({ _id: blogId }, { title, content }, { new: true }).select('-comments');

  res.status(200).json({
    status: "success",
    data: {
      blog: updatedBlog
    }
  })
});

export { getBlogs, createBlog, deleteBlog, getBlog, updateBlog };