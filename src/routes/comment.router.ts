import { Router } from "express";
import { authenticateJWT } from "../controllers/auth.controller";
import { addComment } from "../controllers/comment.controller";

const commentRouter = Router();

commentRouter.post('/', authenticateJWT, addComment);
// commentRouter.delete('/:blogId', authenticateJWT, deleteBlog);
// commentRouter.post('/login', login);
// commentRouter.get('/', authenticateJWT, getAllUsers);
// commentRouter.patch('/:id', authenticateJWT, updateUser);

export { commentRouter };