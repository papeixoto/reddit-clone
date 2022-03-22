import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import session from "express-session";
import { createClient } from "redis";
import connectRedis from "connect-redis";
// import cors from "cors";

// creating a main function because we can't top level await
const main = async () => {
  const orm = await MikroORM.init(microConfig);
  await orm.getMigrator().up();

  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = createClient({ legacyMode: true });
  redisClient.connect().catch(console.error);

  const corsOptions = {
    credentials: true,
    origin: "https://studio.apollographql.com",
  };

  // app.use(
  //   cors({
  //     origin: "https://studio.apollographql.com",
  //     credentials: true,
  //   })
  // );
  app.use(
    session({
      name: "qid",
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        // this needs to be none to work on graphql playground
        sameSite: "none", // csrf
        // secure: __prod__, // cookie only works in https
        secure: true,
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
    context: ({ req, res }) => ({ em: orm.em, req, res }),
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app, cors: corsOptions });

  app.listen(4000, () => {
    console.log("server started on localhost:4000");
  });
};

main();
