import { Router } from "express";
import { authenticateJWT } from "../controllers/auth.controller";
import { createBlog, deleteBlog, getBlog, getBlogs, updateBlog } from "../controllers/blog.controller";

const blogRouter = Router();

blogRouter.get('/', authenticateJWT, getBlogs);
blogRouter.get('/:blogId', authenticateJWT, getBlog);
blogRouter.post('/', authenticateJWT, createBlog);
blogRouter.delete('/:blogId', authenticateJWT, deleteBlog);
blogRouter.patch('/', authenticateJWT, updateBlog);

export { blogRouter };
