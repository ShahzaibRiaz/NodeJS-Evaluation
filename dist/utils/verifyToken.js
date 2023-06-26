"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToken = exports.verifyAndDecodeToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyAndDecodeToken = (token) => {
    const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    return decodedToken;
};
exports.verifyAndDecodeToken = verifyAndDecodeToken;
const getToken = (req) => {
    let token;
    const { authorization } = req.headers || {};
    if (authorization && authorization.startsWith('Bearer')) {
        token = authorization.split(' ')[1];
    }
    return token;
};
exports.getToken = getToken;
