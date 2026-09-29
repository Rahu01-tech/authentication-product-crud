import express from "express";

import {
    register,
    login,
    getMe,
    refreshToken,
    logout,
    forgotPassword,
    resetPassword,
} from "../controllers/auth.controller.js";

import {
    registerValidator,
    loginValidator,
    forgotPasswordValidator,
    resetPasswordValidator,
} from "../validators/auth.validator.js";

import { validate } from "../middleware/validation.middleware.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
    "/register",
    registerValidator,
    validate,
    register
);

router.post(
    "/login",
    loginValidator,
    validate,
    login
);

router.post(
    "/refresh-token",
    refreshToken
);

router.post(
    "/logout",
    authenticate,
    logout
);

router.get(
    "/me",
    authenticate,
    getMe
);

router.post(
    "/forgot-password",
    forgotPasswordValidator,
    validate,
    forgotPassword
);

router.post(
    "/reset-password/:token",
    resetPasswordValidator,
    validate,
    resetPassword
);

export default router;