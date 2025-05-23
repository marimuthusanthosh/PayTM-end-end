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
const express_1 = require("express");
const schema_1 = require("../schema");
const userZods_1 = require("../zods/userZods");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret_1 = require("../secret");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
console.log("iam a superstar");
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // your logic here
    const { username, firstName, lastName, password } = req.body;
    const parsedContent = userZods_1.signupBody.safeParse(req.body);
    if (!parsedContent) {
        res.status(400).json({ message: "Wrong inputs" });
    }
    const existingUser = yield schema_1.prisma.user.findFirst({
        where: { username: username }
    });
    if (existingUser) {
        res.status(401).json({ message: "user exists Already" });
    }
    try {
        const response = yield schema_1.prisma.user.create({
            data: {
                username,
                firstName,
                lastName,
                password
            },
        });
        const userId = response.id;
        const information = yield schema_1.prisma.account.create({
            data: {
                userId,
                balance: 1 + Math.random() * 10000
            }
        });
        if (information) {
            console.log("account also created");
        }
        res.status(200).json({ response });
    }
    catch (err) {
        console.log(err);
    }
    finally {
        yield schema_1.prisma.$disconnect();
    }
}));
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, username, password } = req.body;
    const parsedContent = userZods_1.signinBody.safeParse(req.body);
    if (!parsedContent.success) {
        res.status(403).json({ message: "Wrong input format" });
    }
    const userExists = yield schema_1.prisma.user.findFirst({
        where: {
            username: username
        }
    });
    if (userExists) {
        const token = jsonwebtoken_1.default.sign({ userId: userId }, secret_1.JWT_SECRET);
        res.status(200).json({ token: token });
    }
}));
router.put("/edit", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedContent = userZods_1.signinBody.safeParse(req.body);
    if (!parsedContent.success) {
        res.status(403).json({ message: "Wrong input format" });
        return;
    }
    const userId = req.userId;
    try {
        const update = yield schema_1.prisma.user.update({
            where: { id: userId },
            data: parsedContent.data,
        });
        res.status(200).json({ message: "User updated", user: update });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}));
router.get("/bulk", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = req.query.filter || "";
    try {
        const users = yield schema_1.prisma.user.findMany({
            where: {
                OR: [
                    {
                        firstName: {
                            contains: filter,
                            mode: "insensitive"
                        }
                    },
                    {
                        lastName: {
                            contains: filter,
                            mode: "insensitive"
                        }
                    }
                ]
            },
            select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true
            }
        });
        res.json({
            users: users.map(user => ({
                _id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName
            }))
        });
    }
    catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
exports.default = router;
