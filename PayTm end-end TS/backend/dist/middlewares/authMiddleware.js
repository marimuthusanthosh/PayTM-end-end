"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret_1 = require("../secret");
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ message: "Unauthorized" });
        return; // Just stop execution
    }
    const token = authHeader;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret_1.JWT_SECRET);
        if (decoded && decoded.userId) {
            req.userId = decoded.userId;
            next(); // proceed
        }
        else {
            res.status(401).json({ message: "Invalid token payload" });
        }
    }
    catch (err) {
        console.error("Invalid token:", token);
        res.status(401).json({ message: "Invalid or expired token" });
    }
};
exports.authMiddleware = authMiddleware;
