import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { User } from "../models/user.model";
import asyncHandler from "../utils/asyncWrapper";
import { AppError } from "../utils/appError";
import { getToken, verifyAndDecodeToken } from "../utils/verifyToken";

const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: process.env.JWT_EXPIRY });
}

const signup = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm
    });

    const token = signToken(user.id);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user
      }
    });
});

const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

  const { email, password } = req.body || {};

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  // Check if user exists and password is correct
  const user = await User.findOne({ email }).select('+password');

  const isPasswordCorrect = await user?.correctPassword(password, user.password || '');

  if(!user || !isPasswordCorrect) {
    return next(new AppError('Incorrect email or password.', 401));
  }
  const token = signToken(user.id);

  // Create and return the token
  res.status(200).json({
    status: 'success',
    token,
  })
});

const authenticateJWT = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // Check if token exists on header
  const token = getToken(req);

  if (!token) {
    return next(new AppError('You are not logged in, Please login to get access', 401));
  }

  const { id } = verifyAndDecodeToken(token);

  // GOTCHA: Check if user exists because maybe user deleted from the DB but his valid token exists.
  const user = await User.findById(id);
  if (!user) {
    return next(new AppError('The token belongs to the user does no longer exists.', 401));
  }

  next();
});

export { signup, login, authenticateJWT }
