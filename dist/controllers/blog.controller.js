"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBlog = exports.getBlog = exports.deleteBlog = exports.createBlog = exports.getBlogs = void 0;
const asyncWrapper_1 = __importDefault(require("../utils/asyncWrapper"));
const blog_model_1 = require("../models/blog.model");
const verifyToken_1 = require("../utils/verifyToken");
const appError_1 = require("../utils/appError");
const comment_model_1 = require("../models/comment.model");
const createBlog = (0, asyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content } = req.body || {};
    const token = (0, verifyToken_1.getToken)(req);
    if (!token) {
        return next(new appError_1.AppError('Invalid token, please login again to get access.', 401));
    }
    const { id } = (0, verifyToken_1.verifyAndDecodeToken)(token);
    const blog = yield blog_model_1.Blog.create({ title, content, userId: id });
    res.status(201).json({
        status: "success",
        data: {
            blog
        }
    });
}));
exports.createBlog = createBlog;
const getBlogs = (0, asyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: Implement the pagination and sorting on Blogs (TASK)
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'asc' } = req.query;
    // Convert query parameters to numbers
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    // Calculate skip value based on page and limit
    const skip = (pageNumber - 1) * limitNumber;
    // Create sort object based on sortBy and sortOrder
    const sort = { [sortBy]: sortOrder };
    const blogs = yield blog_model_1.Blog.find()
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
}));
exports.getBlogs = getBlogs;
const getBlog = (0, asyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { blogId } = req.params;
    const blog = yield blog_model_1.Blog.findById(blogId).populate('comments');
    if (!blog) {
        return next(new appError_1.AppError('Blog not found with given ID.', 404));
    }
    res.status(200).json({
        status: "success",
        data: {
            blog
        }
    });
}));
exports.getBlog = getBlog;
const deleteBlog = (0, asyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if userId inside token is same as for the blog owner (userId)
    const { blogId } = req.params || {};
    const token = (0, verifyToken_1.getToken)(req);
    const { id: userId } = (0, verifyToken_1.verifyAndDecodeToken)(token);
    const blog = yield blog_model_1.Blog.findOne({ _id: blogId });
    if (!blog) {
        return next(new appError_1.AppError('Invalid Blog ID.', 400));
    }
    if (blog.userId.toString() !== userId) {
        return next(new appError_1.AppError('You dont have access for this operation.', 403));
    }
    const deletedBlog = yield blog_model_1.Blog.findByIdAndDelete(blogId);
    yield comment_model_1.Comment.deleteMany({ _id: { $in: blog.comments } });
    res.status(200).json({
        status: "success",
        data: {
            blog: deletedBlog
        }
    });
}));
exports.deleteBlog = deleteBlog;
const updateBlog = (0, asyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { blogId, title = '', content } = req.body || {};
    const updateFields = {};
    if (title !== '') {
        updateFields.title = title;
    }
    if (content !== '') {
        updateFields.content = content;
    }
    const token = (0, verifyToken_1.getToken)(req);
    const { id: userId } = (0, verifyToken_1.verifyAndDecodeToken)(token);
    const blog = yield blog_model_1.Blog.findOne({ _id: blogId });
    if (!blog) {
        return next(new appError_1.AppError('Invalid blog ID.', 400));
    }
    if (blog.userId.toString() !== userId) {
        return next(new appError_1.AppError('You dont have access for this operation.', 403));
    }
    const updatedBlog = yield blog_model_1.Blog.findOneAndUpdate({ _id: blogId }, { title, content }, { new: true }).select('-comments');
    res.status(200).json({
        status: "success",
        data: {
            blog: updatedBlog
        }
    });
}));
exports.updateBlog = updateBlog;
