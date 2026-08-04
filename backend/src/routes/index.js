import { Router } from "express";
import healthRouter from "./health.js";
import moviesRouter from "./movies.js";

const router = Router();

router.use("/health", healthRouter);
router.use("/movies", moviesRouter);

export default router;
