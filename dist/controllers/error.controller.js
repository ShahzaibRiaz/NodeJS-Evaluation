"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const handleValidationError = (error) => {
    error.statusCode = 400;
    return error;
};
const handleDuplicateError = (error) => {
    error.statusCode = 400;
    return error;
};
const handleJsonWebTokenError = (error) => {
    error.statusCode = 401;
    error.message = 'Invalid token please login again.';
    return error;
};
const handleExpireJwtToken = (error) => {
    error.statusCode = 401;
    error.message = 'Your token has expired please login in again.';
    return error;
};
const globalErrorHandler = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';
    let err = Object.assign({}, error);
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
};
exports.globalErrorHandler = globalErrorHandler;
