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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const schema_1 = require("../schema");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.get("/balance", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const account = yield schema_1.prisma.account.findFirst({
            where: {
                userId: req.userId,
            },
        });
        if (!account) {
            res.status(404).json({ message: "Account not found" });
            return;
        }
        res.status(200).json({ balance: account.balance });
    }
    catch (error) {
        console.error("Error fetching balance:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
router.get("/getallbalance", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accounts = yield schema_1.prisma.account.findMany();
        res.status(200).json({ accounts });
    }
    catch (error) {
        console.error("Failed to fetch accounts", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
router.post("/transfer", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount, to } = req.body;
    if (!req.userId) {
        res.status(401).json({ message: "Unauthorized" });
    }
    if (typeof amount !== "number" || amount <= 0) {
        res.status(400).json({ message: "Invalid transfer amount" });
    }
    try {
        // Prisma transaction
        yield schema_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // Get sender account
            const senderAccount = yield tx.account.findFirst({
                where: { userId: req.userId },
            });
            if (!senderAccount || senderAccount.balance < amount) {
                throw new Error("Insufficient balance");
            }
            // Get receiver account
            const receiverAccount = yield tx.account.findFirst({
                where: { userId: to },
            });
            if (!receiverAccount) {
                throw new Error("Invalid recipient account");
            }
            // Update sender balance (deduct amount)
            yield tx.account.update({
                where: { id: senderAccount.id }, // <-- use account.id here
                data: { balance: senderAccount.balance - amount },
            });
            // Update receiver balance (add amount)
            yield tx.account.update({
                where: { id: receiverAccount.id }, // <-- use account.id here
                data: { balance: receiverAccount.balance + amount },
            });
        }));
        res.json({ message: "Transfer successful" });
    }
    catch (error) {
        console.error("Transfer error:", error);
        const msg = error.message === "Insufficient balance" ||
            error.message === "Invalid recipient account"
            ? error.message
            : "Transfer failed";
        res.status(400).json({ message: msg });
    }
}));
exports.default = router;
