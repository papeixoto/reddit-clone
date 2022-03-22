import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import path from "path";
import { User } from "./entities/User";

export default {
  migrations: {
    // path: "./migrations",
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.ts$/,
  },
  entities: [Post, User],
  dbName: "lireddit",
  type: "postgresql",
  debug: !__prod__,
  user: "postgres",
  password: "postgres",
  allowGlobalContext: true,
} as Parameters<typeof MikroORM.init>[0];

// KNOW: if we just export the object the type will be a string.
// And that makes the creating MikroORM.init mad because there's a type error
// To go around that we can export as a const

// KNOW: Advanced tip
// To give it the correct type you can export it as the type that the external
// function expects to receive
