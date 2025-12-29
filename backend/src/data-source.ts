import "reflect-metadata";
import { DataSource } from "typeorm";
import * as path from "node:path";
import * as dotenv from "dotenv";
import { User } from "./entities/User";
import { VolunteerOpportunity } from "./entities/VolunteerOpportunity";

dotenv.config();

// cria db.sqlite na raiz do backend
const dbFile = process.env.DB_FILE || path.resolve(process.cwd(), "db.sqlite");

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: dbFile,
  entities: [User, Institution, VolunteerOpportunity, Application],
  synchronize: true,
  logging: false,
});


