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
exports.updateUser = exports.deleteUser = exports.getAllUsers = void 0;
const user_model_1 = require("../models/user.model");
const asyncWrapper_1 = __importDefault(require("../utils/asyncWrapper"));
const appError_1 = require("../utils/appError");
const verifyToken_1 = require("../utils/verifyToken");
const getAllUsers = (0, asyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.User.find();
    res.status(201).json({
        status: 'success',
        users
    });
}));
exports.getAllUsers = getAllUsers;
const updateUser = (0, asyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params || {};
    const { name } = req.body || {};
    if (!name) {
        return next(new appError_1.AppError('Please provide valid payload.', 400));
    }
    const updatedUser = yield user_model_1.User.findOneAndUpdate({ _id: id }, { name }, { new: true });
    if (!updatedUser) {
        return next(new appError_1.AppError('Invalid user id to update.', 400));
    }
    // TODO: Update the user logic here.
    res.status(200).json({ status: 'success', data: { user: updatedUser } });
}));
exports.updateUser = updateUser;
const deleteUser = (0, asyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return next(new appError_1.AppError('Please provide id of user.', 400));
    }
    const token = (0, verifyToken_1.getToken)(req);
    const { id: userId } = (0, verifyToken_1.verifyAndDecodeToken)(token);
    if (id === userId) {
        return next(new appError_1.AppError('You dont have access for this operation.', 403));
    }
    const user = yield user_model_1.User.findByIdAndDelete(id);
    if (!user) {
        return next(new appError_1.AppError('Invalid user id.', 400));
    }
    res.status(200).json({ status: 'success', data: { user } });
}));
exports.deleteUser = deleteUser;
