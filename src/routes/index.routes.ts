import { Request, Response, NextFunction } from "express";
import { Router } from "express";
import prisma from "../db";

const router = Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json("All good in here :)");
});

router.get("/movies", async (req, res) => {
  try {
    // Test database connection with a simple query
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Database movies check failed:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to connect to the database",
    });
  }
});

export default router;
