import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            select: false,
        },

        refreshToken: {
            type: String,
            default: null,
            select: false,
        },

        resetPasswordToken: {
           type: String,
           default: null,
           select: false,
       },

       resetPasswordExpires: {
            type: Date,
            default: null,
            select: false,
     },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

export default User;