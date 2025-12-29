import express from "express";
import cors from "cors";
import { authRoutes } from "./routes/authRoutes";
import { opportunityRoutes } from "./routes/opportunityRoutes";
import { institutionRoutes } from "./routes/institutionRoutes";
import { applicationRoutes } from "./routes/applicationRoutes";
import { userRoutes } from "./routes/userRoutes";
import { errorMiddleware } from "./http/errorMiddleware";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.use("/auth", authRoutes());
  app.use("/users", userRoutes());
  app.use("/opportunities", opportunityRoutes());
  app.use("/institutions", institutionRoutes());
  app.use("/applications", applicationRoutes());

  app.use(errorMiddleware);

  return app;
}



