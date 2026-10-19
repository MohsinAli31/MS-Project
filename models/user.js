import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
    {name: {
        type: String,
        required: [true, "Please provide a name"],
        trim: true,
        maxlength: [40, "Name should not be more than 40 characters"]
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
        unique:true,
        lowercase: true,
        maxlength: [40, "Email should not be more than 40 characters"],
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            "Please provide a valid email"
        ]
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: [6, "Password should be at least 6 characters"],
        select: false
    },
    role: {
        type: String,
        default: "Student",
        enum: ["Student", "Teacher", "Admin"],
    },
    resetpasswordToken: String,
    resetpasswordExpire: Date,
    department: {
        type: String,
        trim: true,
        default: null,
    },
    expertise: {
        type: [String],
        default: [],
    },
    maxStudents: {
        type: Number,
        default: 10,
        min: [1, "Min students must be at least 1"],
        max: [100, "Max students cannot exceed 100"],

    },
    assignedStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    superviser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        default: null,
    },
},
    {timestamps: true}
);
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.generateToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
}

userSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetpasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetpasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    return resetToken;
};

export const User = mongoose.model("User", userSchema);