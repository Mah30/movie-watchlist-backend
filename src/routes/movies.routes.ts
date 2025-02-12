import { Router, Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { isAuthenticated } from "../middlewares/route-guard.middleware";

const router = Router();
const prisma = new PrismaClient();

// Interface para listar filmes globais
interface MovieRequest {
  title: string;
  genre: string;
}

/**
 * Listar todos os filmes disponíveis no sistema (GET /api/movies)
 */
router.get("/", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const movies = await prisma.movie.findMany();
    res.status(200).json(movies);
  } catch (error) {
    console.error("Error retrieving movies ->", error);
    next(error);
  }
});

/**
 * Obter um filme específico (GET /api/movies/:movieId)
 */
router.get("/:movieId", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { movieId } = req.params;
  const movieIdNumber = Number(movieId);

  if (isNaN(movieIdNumber)) {
    res.status(400).json({ message: "Invalid Movie ID" });
    return;
  }

  try {
    const movie = await prisma.movie.findUnique({ where: { id: movieIdNumber } });

    if (!movie) {
      res.status(404).json({ message: "Movie not found" });
      return;
    }

    res.status(200).json(movie);
  } catch (error) {
    console.error("Error retrieving movie ->", error);
    next(error);
  }
});

/**
 * Criar um novo filme global (POST /api/movies) - Apenas admins
 */
router.post("/", isAuthenticated, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.isAdmin) {
      res.status(403).json({ message: "Only admins can add new movies!" });
      return;
    }

    const { title, genre }: MovieRequest = req.body;

    const createdMovie = await prisma.movie.create({
      data: { title, genre },
    });

    res.status(201).json(createdMovie);
  } catch (error) {
    console.error("Error while creating the movie ->", error);
    next(error);
  }
});

export default router;
