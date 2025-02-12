import { Request, Response, NextFunction } from "express";
import { Router } from "express";
import userRoutes from "./user.routes";
import movieRoutes from "./movies.routes";

const router = Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json("All good in here :)");
});

router.use("/users", userRoutes);

router.use("/movies", movieRoutes);

router.use ("")

export default router;
