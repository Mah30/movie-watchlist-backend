import { Request, Response, NextFunction } from "express";

export const requireUser = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ message: "User not authenticated" });
    return;
  }
  next(); 
};