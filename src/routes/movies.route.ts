import { Router, Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";


const router = Router();
/* const router = express.Router(); */
const prisma = new PrismaClient();
/* const express = require('express'); */


// corpo da requisição de Movie
interface MovieRequest {
  title: string;
  genre: string;
  status: "To Watch" | "Watched";
  rating?: number;
  userId: number;
}

//  Listar todos os filmes (GET /api/movies)
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const movies = await prisma.movie.findMany();
    console.log("Retrieved movies ->", movies);
    res.status(200).json(movies);
    return;
  } catch (error) {
    console.error("Error while retrieving movies ->", error);
    next(error);
  }
});

// -  (GET /api/movies/:movieId) - Obtem um filme específico por ID
router.get("/:movieId", async (req: Request, res: Response, next: NextFunction)/* : Promise<void>  */=> {
  const { movieId } = req.params;
  const movieIdNumber = Number(movieId);

  if (isNaN(movieIdNumber)) {
     res.status(400).json({ message: "Invalid Movie ID" });
    
  }

  try {
    const movie = await prisma.movie.findUnique({ where: { id: movieIdNumber } });
    if (!movie) {
      res.status(404).json({ message: "Movie not found" });
    }
    res.status(200).json(movie);
  } catch (error) {
    console.error("Error retrieving movie ->", error);
    next(error);
  }
});

// - Criar um novo filme (POST /api/movies)
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, genre, status, rating, userId }: MovieRequest = req.body;

    if (!userId) {
       res.status(400).json({message: "User ID is required to create a movie"});
    }

    const createdMovie = await prisma.movie.create({
      data: { title, genre, status, rating, userId },
    });

    console.log("Movie added ->", createdMovie);
    res.status(201).json(createdMovie);
  } catch (error) {
    console.error("Error while creating the movie ->", error);
    next(error);
  }
});

// - Atualizar um filme (PUT /api/movies/:movieId)
router.put<{ movieId: string }, MovieRequest>("/:movieId", async (req: Request, res: Response, next: NextFunction) => {
  const { movieId } = req.params;
  const movieIdNumber = Number(movieId);

  if (isNaN(movieIdNumber)) {
     res.status(400).json({ message: "Invalid Movie ID" });
  }

  try {
    const { title, genre, status, rating }: MovieRequest = req.body;

    const updatedMovie = await prisma.movie.update({
      where: { id: movieIdNumber },
      data: { title, genre, status, rating },
    });

    res.status(200).json(updatedMovie);
  } catch (error) {
    console.log("Error updating movie ->", error);
    //next(error);
  }
});

// - Obter todos os filmes com um determinado status (GET /api/movies/status/:status)
router.get("/status/:status", async (req: Request, res: Response, next: NextFunction) => {
  const { status } = req.params;

  if (status !== "To Watch" && status !== "Watched") {
     res.status(400).json({ message: "Invalid status. Use 'To Watch' or 'Watched'." });
  }

  try {
    const movies = await prisma.movie.findMany({ where: { status } });

    if (!movies.length) {
       res.status(404).json({ message: "No movies found with this status" });
    }

    res.status(200).json(movies);
  } catch (error) {
    console.error("Error retrieving movies by status ->", error);
    next(error);
  }
});

// - Deletar um filme (DELETE /api/movies/:movieId)
router.delete("/:movieId", async (req: Request, res: Response, next: NextFunction) => {
  const { movieId } = req.params;
  const movieIdNumber = Number(movieId);

  if (isNaN(movieIdNumber)) {
    res.status(400).json({ message: "Invalid Movie ID" });
  }

  try {
    const deletedMovie = await prisma.movie.delete({ where: { id: movieIdNumber } });

    res.status(200).json({ message: `Movie with ID ${deletedMovie.id} was deleted successfully` });
  } catch (error) {
    console.log("Error deleting movie ->", error);
    next(error);
  }
});

export default router;