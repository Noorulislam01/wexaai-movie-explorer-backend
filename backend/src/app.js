import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { config } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

const corsOptions = config.frontendOrigin
  ? {
      origin: config.frontendOrigin,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    }
  : undefined;

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "WexaAI backend is running",
  });
});

app.use("/api", routes);
app.use(errorHandler);

export default app;
