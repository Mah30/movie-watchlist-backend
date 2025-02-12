import { Request, Response, NextFunction } from "express";
import { Router } from "express";
import userRoutes from "./user.routes";
import movieRoutes from "./movies.routes";
import userMoviesRoutes from "./userMovies.routes";

const router = Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json("All good in here :)");
});

// Rotas de usuários
router.use("/users", userRoutes);

// Rotas de filmes globais
router.use("/movies", movieRoutes);

router.use("/user-movies", userMoviesRoutes); 

export default router;
