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
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_router_1 = require("./routes/user.router");
const appError_1 = require("./utils/appError");
const error_controller_1 = require("./controllers/error.controller");
const blog_router_1 = require("./routes/blog.router");
const comment_router_1 = require("./routes/comment.router");
const morgan_1 = __importDefault(require("morgan"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
const mongoUser = process.env.MONGO_USER;
const mongoPassword = process.env.MONGO_PASSWORD;
// Body parser.
app.use(express_1.default.json());
// Logging (Winston || Morgan)
app.use((0, morgan_1.default)('dev'));
// Routes
app.use('/api/v1/users', user_router_1.userRouter);
app.use('/api/v1/blogs', blog_router_1.blogRouter);
app.use('/api/v1/comments', comment_router_1.commentRouter);
// Unregistered Routes
app.all('*', (req, res, next) => {
    next(new appError_1.AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
// Gobal error handler
app.use(error_controller_1.globalErrorHandler);
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(`mongodb+srv://${mongoUser}:${mongoPassword}@blogc1.euiatkz.mongodb.net/`);
        console.log('⚡️[MongoDB]: connection established successfully.');
        app.listen(port, () => {
            console.log(`⚡️[Server]: Server is running at http://localhost:${port}`);
        });
    }
    catch (error) {
        console.error('Something went wrong while initial setup.', error);
    }
}))();
