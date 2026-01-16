import cors from "cors";
import express from "express";
import { errorMiddleware } from "./http/errorMiddleware";
import { applicationRoutes } from "./routes/applicationRoutes";
import { authRoutes } from "./routes/authRoutes";
import { institutionRoutes } from "./routes/institutionRoutes";
import { opportunityRoutes } from "./routes/opportunityRoutes";
import { userRoutes } from "./routes/userRoutes";

// Cria e configura instancia do Express com middlewares e rotas
export function createApp() {
  const app = express();

  // Habilita CORS e JSON body parser
  app.use(cors());
  app.use(express.json());

  // Endpoint simples de healthcheck
  app.get("/health", (_req, res) => res.json({ ok: true }));

  // Agrupa rotas da API
  app.use("/auth", authRoutes());
  app.use("/users", userRoutes());
  app.use("/opportunities", opportunityRoutes());
  app.use("/institutions", institutionRoutes());
  app.use("/applications", applicationRoutes());

  // Middleware global de tratamento de erros
  app.use(errorMiddleware);

  return app;
}
