import "reflect-metadata";
import { DataSource } from "typeorm";
import * as path from "node:path";
import * as dotenv from "dotenv";

dotenv.config();

// cria db.sqlite na raiz do backend
const dbFile = process.env.DB_FILE || path.resolve(process.cwd(), "db.sqlite");

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: dbFile,
  entities: [],
  synchronize: true,
  logging: false,
});


