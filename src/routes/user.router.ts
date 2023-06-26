import { Router } from "express";
import { authenticateJWT, login, signup } from "../controllers/auth.controller";
import { deleteUser, getAllUsers, updateUser } from "../controllers/user.controller";

const userRouter = Router();

userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.get('/', authenticateJWT, getAllUsers);
userRouter.delete('/:id', authenticateJWT, deleteUser);
userRouter.patch('/:id', authenticateJWT, updateUser);

export { userRouter };
