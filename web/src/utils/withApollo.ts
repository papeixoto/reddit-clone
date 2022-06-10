import { withApollo as createWithApollo } from "next-apollo";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { PaginatedPosts } from "../generated/graphql";
import { NextPageContext } from "next";

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        posts: {
          keyArgs: [],
          merge(
            existing: PaginatedPosts | undefined,
            incoming: PaginatedPosts
          ): PaginatedPosts {
            console.log(existing, incoming);
            return {
              ...incoming,
              posts: [...(existing?.posts || []), ...incoming.posts],
            };
          },
        },
      },
    },
  },
});

const createClient = (ctx: NextPageContext) =>
  new ApolloClient({
    uri: process.env.NEXT_PUBLIC_API_URL,
    credentials: "include",
    headers: {
      cookie:
        (typeof window === "undefined"
          ? ctx?.req?.headers.cookie
          : undefined) || "",
    },
    cache,
  });

export const withApollo = createWithApollo(createClient);
