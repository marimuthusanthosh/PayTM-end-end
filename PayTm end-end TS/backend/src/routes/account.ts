import {Router,Request,Response} from "express";

import { prisma } from '../schema';
import { signinBody, signupBody } from '../zods/userZods';
import jwt from "jsonwebtoken";
import { JWT_SECRET } from '../secret';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
declare global {
  namespace Express {
    interface Request {
      userId?: number; // Prisma userId is Int, so number
    }
  }
}


router.get("/balance", authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const account = await prisma.account.findFirst({
      where: {
        userId: req.userId,
      },
    });

    if (!account) {
      res.status(404).json({ message: "Account not found" });
      return;
    }

    res.status(200).json({ balance: account.balance });
  } catch (error) {
    console.error("Error fetching balance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/getallbalance", authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const accounts = await prisma.account.findMany();
    res.status(200).json({ accounts });
  } catch (error) {
    console.error("Failed to fetch accounts", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post(
  "/transfer",
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    const { amount, to } = req.body;

    if (!req.userId) {
       res.status(401).json({ message: "Unauthorized" });
    }

    if (typeof amount !== "number" || amount <= 0) {
       res.status(400).json({ message: "Invalid transfer amount" });
    }

    try {
      // Prisma transaction
      await prisma.$transaction(async (tx) => {
        // Get sender account
        const senderAccount = await tx.account.findFirst({
          where: { userId: req.userId },
        });

        if (!senderAccount || senderAccount.balance < amount) {
          throw new Error("Insufficient balance");
        }

        // Get receiver account
        const receiverAccount = await tx.account.findFirst({
          where: { userId: to },
        });

        if (!receiverAccount) {
          throw new Error("Invalid recipient account");
        }

        // Update sender balance (deduct amount)
        await tx.account.update({
          where: { id: senderAccount.id }, // <-- use account.id here
          data: { balance: senderAccount.balance - amount },
        });

        // Update receiver balance (add amount)
        await tx.account.update({
          where: { id: receiverAccount.id }, // <-- use account.id here
          data: { balance: receiverAccount.balance + amount },
        });
      });

      res.json({ message: "Transfer successful" });
    } catch (error: any) {
      console.error("Transfer error:", error);
      const msg =
        error.message === "Insufficient balance" ||
        error.message === "Invalid recipient account"
          ? error.message
          : "Transfer failed";

      res.status(400).json({ message: msg });
    }
  }
);

export default router;
