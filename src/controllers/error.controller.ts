// Placed it inside error controller because we're intercepting the response and sending it back to User.
import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError";

const handleValidationError = (error: AppError) => {
  error.statusCode = 400;
  return error;
}

const handleDuplicateError = (error: AppError) => {
  error.statusCode = 400;
  return error;
}

const handleJsonWebTokenError = (error: AppError) => {
  error.statusCode = 401;
  error.message = 'Invalid token please login again.'
  return error;
}
const handleExpireJwtToken = (error: AppError) => {
  error.statusCode = 401;
  error.message = 'Your token has expired please login in again.'
  return error;
}

const globalErrorHandler = (error: AppError, req: Request, res: Response, next: NextFunction) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  let err = { ...error };
  err.message = error.message;
  err.name = error.name;

  console.log('error Object', err);

  if (err.name === 'ValidationError') {
    err = handleValidationError(err);
  }
  if (err.code === 11000) {
    err = handleDuplicateError(err);
  }
  if (err.name === 'JsonWebTokenError') {
    err = handleJsonWebTokenError(err);
  }
  if (err.name === 'TokenExpiredError') {
    err = handleExpireJwtToken(err);
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err
  });
}

export { globalErrorHandler }
