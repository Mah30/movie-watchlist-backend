import { Router, Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { isAuthenticated } from "../middlewares/route-guard.middleware";
import  {requireUser}  from "../middlewares/requireUser";
import { TokenPayload } from "../middlewares/route-guard.middleware"; 



const router = Router();
const prisma = new PrismaClient();


// Interface para gerenciar a watchlist do usuário
interface UserMovieRequest {
  movieId: number;
  status?: "To Watch" | "Watched";
  rating?: number;
}

// atualizacao a tipagem de `AuthenticatedRequest` para usar `TokenPayload`
interface AuthenticatedRequest extends Request {
  user: TokenPayload;
}


/**
 * Adicionar um filme à watchlist do usuário (POST /api/user-movies)
 */
router.post("/", isAuthenticated, requireUser, async (req: Request, res: Response, next: NextFunction): Promise<void>=> {

  if (!req.user) {
    void res.status(401).json({ message: "User not authenticated" });
    return
  }

  const userId = req.user.id;

  try {
    const { movieId, status }: UserMovieRequest = req.body;

    if (!movieId) {
      res.status(400).json({ message: "Movie ID is required" });
      return;
    }

    const userMovie = await prisma.userMovie.upsert({
      where: { userId_movieId: { userId , movieId } },
      update: { status },
      create: { userId, movieId, status: status || "To Watch" },
    });

    res.status(201).json(userMovie);
  } catch (error) {
    console.error("Error adding movie to watchlist ->", error);
    next(error);
  }
});

/**
 * Obter a watchlist do usuário autenticado (GET /api/user-movies)
 */
router.get("/:userId", isAuthenticated, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = Number(req.params.userId);

    if (isNaN(userId)) {
      res.status(400).json({ message: "Invalid User ID" });
      return;
    }

    const watchlist = await prisma.userMovie.findMany({
      where: { userId },
      include: { movie: true },
    });

    if (watchlist.length === 0) {
      res.status(404).json({ message: "No movies found for this user" });
      return;
    }

    res.status(200).json(watchlist);
  } catch (error) {
    console.error("Error retrieving watchlist ->", error);
    next(error);
  }
});

/**
 * Atualizar o status de um filme na watchlist (PUT /api/user-movies/:movieId)
 */
router.put("/:movieId", isAuthenticated, requireUser, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  
  const { movieId } = req.params;
  const { status }: UserMovieRequest = req.body;

  if (!req.user) {
    void res.status(401).json({ message: "User not authenticated" });
    return
  }

  const userId = req.user.id;

  try {
    const updatedUserMovie = await prisma.userMovie.update({
      where: { userId_movieId: { userId, movieId: Number(movieId) } },
      data: { status },
    });

    res.status(200).json(updatedUserMovie);
  } catch (error) {
    console.error("Error updating movie status ->", error);
    next(error);
  }
});

/**
 * Remover um filme da watchlist (DELETE /api/user-movies/:movieId)
 */
router.delete("/:movieId", isAuthenticated, requireUser, async (req: Request, res: Response, next: NextFunction): Promise<void> => {

  if (!req.user) {
    void res.status(401).json({ message: "User not authenticated" });
    return
  }

  const userId = req.user.id;
  const movieId = Number(req.params.movieId);


  if (isNaN(movieId)) {
    res.status(400).json({ message: "Invalid Movie ID" });
    return;
  }


  try {
    await prisma.userMovie.delete({
      where: { userId_movieId: { userId, movieId } },
    });

    res.status(200).json({ message: "Movie removed from watchlist" });
  } catch (error) {
    console.error("Error removing movie from watchlist ->", error);
    next(error);
  }
});



export default router;