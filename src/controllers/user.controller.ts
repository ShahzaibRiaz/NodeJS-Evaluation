import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.model";
import asyncHandler from "../utils/asyncWrapper";
import { AppError } from "../utils/appError";
import { getToken, verifyAndDecodeToken } from "../utils/verifyToken";

const getAllUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find();
    res.status(201).json({
      status: 'success',
      users
    });
});

const updateUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params || {};
  const { name } = req.body || {};
  if (!name) {
    return next(new AppError('Please provide valid payload.', 400));
  }

  const updatedUser = await User.findOneAndUpdate({ _id: id }, { name }, { new: true });
  if (!updatedUser) {
    return next(new AppError('Invalid user id to update.', 400));
  }
  // TODO: Update the user logic here.
  res.status(200).json({ status: 'success', data: { user: updatedUser }});
});

const deleteUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id) {
    return next(new AppError('Please provide id of user.', 400));
  }
  const token = getToken(req);
  const { id: userId } = verifyAndDecodeToken(token!);

  if (id === userId) {
    return next(new AppError('You dont have access for this operation.', 403));
  }

  const user = await User.findByIdAndDelete(id);
  if (!user) {
    return next(new AppError('Invalid user id.', 400));
  }

  res.status(200).json({status: 'success', data: { user }});
});

export { getAllUsers, deleteUser, updateUser }