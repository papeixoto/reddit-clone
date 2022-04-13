import { DataSource } from "typeorm";
import { Post } from "./entities/Post";
import { User } from "./entities/User";

export const AppDataSource = new DataSource({
  type: "postgres",
  database: "lireddit",
  // username: "postgres",
  // password: "postgres",
  logging: true,
  synchronize: true,
  entities: [Post, User],
});
