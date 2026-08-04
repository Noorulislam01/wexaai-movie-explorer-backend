import { Router } from "express";
import { getMovieById, getMovies, getRecommendationsForUser } from "../services/movieService.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const movies = await getMovies();
    res.json({
      status: "ok",
      count: movies.length,
      data: movies,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/recommendations/:userId", async (req, res, next) => {
  try {
    const recommendations = await getRecommendationsForUser(req.params.userId);

    res.json({
      status: "ok",
      count: recommendations.length,
      data: recommendations,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:movieId", async (req, res, next) => {
  try {
    const movie = await getMovieById(req.params.movieId);

    if (!movie) {
      return res.status(404).json({
        status: "error",
        message: "Movie not found",
      });
    }

    res.json({
      status: "ok",
      data: movie,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
