import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { COOKIE_NAME, __prod__ } from "./constants";
import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import session from "express-session";
import Redis from "ioredis";
import connectRedis from "connect-redis";
import cors from "cors";

// creating a main function because we can't top level await
const main = async () => {
  const orm = await MikroORM.init(microConfig);
  // to delete a table
  // await orm.em.nativeDelete(User, {});

  await orm.getMigrator().up();

  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis();
  // redisClient.connect().catch(console.error);

  app.use(
    cors({
      credentials: true,
      origin: ["https://studio.apollographql.com", "http://localhost:3000"],
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        // for localhost
        sameSite: "lax", // csrf
        secure: __prod__, // cookie only works in https
        // for graphql playground
        // sameSite: "none", // csrf
        // secure: true,
      },
      saveUninitialized: false,
      secret: "keyboard cat",
      resave: false,
    })
  );

  // needed for dev cookies
  // not in tutorial
  app.set("trust proxy", true);

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ em: orm.em, req, res, redis }),
  });

  await apolloServer.start();

  // apolloServer.applyMiddleware({ app, cors: corsOptions });
  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => {
    console.log("server started on localhost:4000");
  });
};

main();
