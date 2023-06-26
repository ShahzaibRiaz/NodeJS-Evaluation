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
exports.authenticateJWT = exports.login = exports.signup = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const asyncWrapper_1 = __importDefault(require("../utils/asyncWrapper"));
const appError_1 = require("../utils/appError");
const verifyToken_1 = require("../utils/verifyToken");
const signToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY });
};
const signup = (0, asyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.create({
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
}));
exports.signup = signup;
const login = (0, asyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body || {};
    if (!email || !password) {
        return next(new appError_1.AppError('Please provide email and password', 400));
    }
    // Check if user exists and password is correct
    const user = yield user_model_1.User.findOne({ email }).select('+password');
    const isPasswordCorrect = yield (user === null || user === void 0 ? void 0 : user.correctPassword(password, user.password || ''));
    if (!user || !isPasswordCorrect) {
        return next(new appError_1.AppError('Incorrect email or password.', 401));
    }
    const token = signToken(user.id);
    // Create and return the token
    res.status(200).json({
        status: 'success',
        token,
    });
}));
exports.login = login;
const authenticateJWT = (0, asyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if token exists on header
    const token = (0, verifyToken_1.getToken)(req);
    if (!token) {
        return next(new appError_1.AppError('You are not logged in, Please login to get access', 401));
    }
    const { id } = (0, verifyToken_1.verifyAndDecodeToken)(token);
    // GOTCHA: Check if user exists because maybe user deleted from the DB but his valid token exists.
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        return next(new appError_1.AppError('The token belongs to the user does no longer exists.', 401));
    }
    next();
}));
exports.authenticateJWT = authenticateJWT;
