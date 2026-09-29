import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import User from "../models/user.model.js";
import config from "../config/config.js";
import {
    generateAccessToken,
    generateRefreshToken,
} from "../utils/jwt.utils.js";

export async function register(req, res) {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "Email already registered",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Register error:", error.message);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const accessToken = generateAccessToken(user._id);

        const refreshToken = generateRefreshToken(user._id);

        user.refreshToken = refreshToken;

        await user.save();

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            message: "Login successful",
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Login error:", error.message);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

export async function getMe(req, res) {
    try {
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.status(200).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Get user error:", error.message);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
}


export async function refreshToken(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                message: "Refresh token is required",
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            config.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decoded.userId).select(
            "+refreshToken"
        );

        if (!user) {
            return res.status(401).json({
                message: "Invalid refresh token",
            });
        }

        if (user.refreshToken !== refreshToken) {
            return res.status(401).json({
                message: "Invalid refresh token",
            });
        }

        const accessToken = generateAccessToken(user._id);

        return res.status(200).json({
            message: "Access token refreshed successfully",
            accessToken,
        });
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired refresh token",
        });
    }
}

export async function logout(req, res) {
    try {
        const user = await User.findById(req.user.userId).select(
            "+refreshToken"
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        user.refreshToken = null;

        await user.save();

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        return res.status(200).json({
            message: "Logout successful",
        });
    } catch (error) {
        console.error("Logout error:", error.message);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
}


export async function forgotPassword(req, res) {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(200).json({
                message:
                    "If an account with this email exists, a reset link has been sent.",
            });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");

        const hashedResetToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.resetPasswordToken = hashedResetToken;

        user.resetPasswordExpires =
            Date.now() + 15 * 60 * 1000;

        await user.save();

        console.log("Password reset token:", resetToken);

        return res.status(200).json({
            message:
                "If an account with this email exists, a reset link has been sent.",
        });
    } catch (error) {
        console.error(
            "Forgot password error:",
            error.message
        );

        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

export async function resetPassword(req, res) {
    try {
        const { token } = req.params;
        const { password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match",
            });
        }

        const hashedResetToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedResetToken,
            resetPasswordExpires: { $gt: Date.now() },
        }).select("+resetPasswordToken");

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired reset token",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;

        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;

        user.refreshToken = null;

        await user.save();

        return res.status(200).json({
            message: "Password reset successfully",
        });
    } catch (error) {
        console.error(
            "Reset password error:",
            error.message
        );

        return res.status(500).json({
            message: "Internal server error",
        });
    }
}