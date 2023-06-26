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
exports.addComment = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
const asyncWrapper_1 = __importDefault(require("../utils/asyncWrapper"));
const blog_model_1 = require("../models/blog.model");
const verifyToken_1 = require("../utils/verifyToken");
const appError_1 = require("../utils/appError");
const comment_model_1 = require("../models/comment.model");
const queue = 'RabbitMQ_Queue';
const addComment = (0, asyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { comment: content, blogId } = req.body || {};
    const blog = yield blog_model_1.Blog.findOne({ _id: blogId });
    if (!blog) {
        return next(new appError_1.AppError('Please provide valid blog id.', 400));
    }
    const token = (0, verifyToken_1.getToken)(req);
    const { id: userId } = (0, verifyToken_1.verifyAndDecodeToken)(token);
    const commentDB = yield comment_model_1.Comment.create({ comment: content, blogId, userId });
    // find the blog by Id and update the comments array.
    yield blog_model_1.Blog.findByIdAndUpdate(blogId, { $push: { comments: commentDB._id } });
    // Once the comment added send message to RabbitMQ
    yield sendEmailNotification(commentDB);
    res.status(201).json({
        status: "success",
        data: {
            comment: commentDB
        }
    });
}));
exports.addComment = addComment;
function sendEmailNotification(comment) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield amqplib_1.default.connect(process.env.RABBIT_MQ);
        const channel = yield connection.createChannel();
        // Send dummy message to RabbitMQ (Cloud)
        channel.sendToQueue(queue, Buffer.from(comment.comment));
        // Close the channel and connection to prevent memory leakage.
        yield channel.close();
        yield connection.close();
    });
}
