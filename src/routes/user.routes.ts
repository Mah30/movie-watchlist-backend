import express, { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { isAdmin, isAuthenticated } from "../middlewares/route-guard.middleware";
import { hashPassword } from "../user";

const router = express.Router();
const prisma = new PrismaClient();

// Interface para definir os dados do usuário
interface UserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isAdmin?: boolean;
}

// GET /api/users - Retorna todos os usuários (Somente Admin)
router.get("/", isAuthenticated, isAdmin, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await prisma.user.findMany();
    console.log("Retrieved users ->", users);
    res.status(200).json(users);
  } catch (error) {
    console.error("Error while retrieving users ->", error);
    next(error);
  }
});

// 📌 GET /api/users/:userId - Retorna um usuário específico
router.get("/:userId", isAuthenticated, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId } = req.params;

  if (!(Number(userId) === req.user?.id || req.user?.isAdmin)) {
    res.status(403).json({ message: "You cannot see the data of other users!" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// POST /api/users - Cria um novo usuário (Somente Admin)
router.post("/", isAuthenticated, isAdmin, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const newUser: UserRequest = req.body;
    const createdUser = await prisma.user.create({
      data: hashPassword(newUser),
    });

    console.log("User added ->", createdUser);
    res.status(201).json(createdUser);
  } catch (error) {
    console.error("Error while creating the user ->", error);
    next(error);
  }
});

// PUT /api/users/:userId - Atualiza um usuário específico
router.put("/:userId", isAuthenticated, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId } = req.params;

  if (!(Number(userId) === req.user?.id || req.user?.isAdmin)) {
    res.status(403).json({ message: "You cannot change the data of another user!" });
    return;
  }

  const updatedUser: UserRequest = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: Number(userId) },
      data: hashPassword(req.body),
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// DELETE /api/users/:userId - Deleta um usuário (Somente Admin)
router.delete("/:userId", isAuthenticated, isAdmin, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await prisma.user.delete({ where: { id: Number(req.params.userId) } });
    res.status(204).json();
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default router;
