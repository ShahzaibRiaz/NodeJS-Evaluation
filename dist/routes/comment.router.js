"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const comment_controller_1 = require("../controllers/comment.controller");
const commentRouter = (0, express_1.Router)();
exports.commentRouter = commentRouter;
commentRouter.post('/', auth_controller_1.authenticateJWT, comment_controller_1.addComment);
