import { Request, Response, NextFunction } from "express";
import { Router } from "express";
import movieRoutes from "./movies.route";

const router = Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json("All good in here :)");
});

router.use("/movies", movieRoutes);

export default router;
