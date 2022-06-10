import { withApollo as createWithApollo } from "next-apollo";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { PaginatedPosts } from "../generated/graphql";

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

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",

  // headers: cookie ? { cookie } : undefined,
  cache,
});

export const withApollo = createWithApollo(client);
