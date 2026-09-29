import jwt from "jsonwebtoken";
import config from "../config/config.js";

export function generateAccessToken(userId) {
    return jwt.sign(
        {
            userId,
        },
        config.ACCESS_TOKEN_SECRET,
        {
            expiresIn: config.ACCESS_TOKEN_EXPIRES_IN,
        }
    );
}

export function generateRefreshToken(userId) {
    return jwt.sign(
        {
            userId,
        },
        config.REFRESH_TOKEN_SECRET,
        {
            expiresIn: config.REFRESH_TOKEN_EXPIRES_IN,
        }
    );
}