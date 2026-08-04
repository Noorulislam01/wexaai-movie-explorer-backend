import { Router } from "express";
import { verifyDbConnection } from "../db/driver.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    await verifyDbConnection();
    res.json({
      status: "ok",
      database: "connected",
    });
  } catch (error) {
    next(error);
  }
});

export default router;

