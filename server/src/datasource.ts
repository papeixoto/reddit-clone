import { DataSource } from "typeorm";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import path from "path";

export const AppDataSource = new DataSource({
  type: "postgres",
  database: "lireddit",
  // username: "postgres",
  // password: "postgres",
  logging: true,
  synchronize: true,
  entities: [Post, User],
  migrations: [path.join(__dirname, "./migrations/*")],
});
