import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { isAuthenticated, TokenPayload } from "../middlewares/route-guard.middleware";

const router = express.Router();
const prisma = new PrismaClient();

// 📌 Interface for Signup Request
interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// 📌 POST /api/auth/signup - User Registration
router.post("/signup", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { firstName, lastName, email, password }: SignupRequest = req.body;

  if (!firstName || !lastName || !email || !password) {
    res.status(400).json({ message: "All required fields must be filled" });
    return;
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(13);
    const passwordHash = bcrypt.hashSync(password, salt);

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash,
      },
    });

    const { passwordHash: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
    return;
  } catch (error) {
    next(error);
    return;
  }
});

// 📌 POST /api/auth/login - User Login
router.post("/login", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(400).json({ message: "No user found with this email" });
      return;
    }

    if (!bcrypt.compareSync(password, user.passwordHash)) {
      res.status(403).json({ message: "Incorrect password" });
      return;
    }

    const payload: TokenPayload = { id: user.id, isAdmin: user.isAdmin };
    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET as string, {
      algorithm: "HS256",
      expiresIn: "6h",
    });

    res.json({ token: authToken });
    return;
  } catch (error) {
    next(error);
    return;
  }
});

// 📌 GET /api/auth/verify - Verify Authentication Token
router.get("/verify", isAuthenticated, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const currentUser = await prisma.user.findUnique({ where: { id: req.user?.id } });

    if (!currentUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(currentUser);
    return;
  } catch (error) {
    console.error("Error during verification:", error);
    next(error);
    return;
  }
});

export default router;
