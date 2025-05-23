import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secret";
// import { JWT_SECRET } from "./config"; // Make sure this exports a string

// Extend Express Request type to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: "Unauthorized" });
    return; // Just stop execution
  }

  const token = authHeader;

  try {
    const decoded = jwt.verify(token, JWT_SECRET!) as { userId: number };

    if (decoded && decoded.userId) {
      req.userId = decoded.userId;
      next(); // proceed
    } else {
      res.status(401).json({ message: "Invalid token payload" });
    }
  } catch (err) {
    console.error("Invalid token:", token);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
