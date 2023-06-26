import express, { Express, NextFunction, Request, Response} from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { userRouter } from './routes/user.router';
import { AppError } from './utils/appError';
import { globalErrorHandler } from './controllers/error.controller';
import { blogRouter } from './routes/blog.router';
import { commentRouter } from './routes/comment.router';
import morgan from 'morgan';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const mongoUser = process.env.MONGO_USER;
const mongoPassword = process.env.MONGO_PASSWORD;

// Body parser.
app.use(express.json());

// Logging (Winston || Morgan)
app.use(morgan('dev'));
// Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/blogs', blogRouter);
app.use('/api/v1/comments', commentRouter);

// Unregistered Routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Gobal error handler
app.use(globalErrorHandler);

(async () => {
  try {
    await mongoose.connect(`mongodb+srv://${mongoUser}:${mongoPassword}@blogc1.euiatkz.mongodb.net/`,);
    console.log('⚡️[MongoDB]: connection established successfully.');

    app.listen(port, () => {
      console.log(`⚡️[Server]: Server is running at http://localhost:${port}`);
    });
  } catch(error) {
    console.error('Something went wrong while initial setup.', error);
  }
})();
