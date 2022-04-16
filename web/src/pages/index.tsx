import { Link } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { Layout } from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => {
  const [{ data }] = usePostsQuery({ variables: { limit: 10 } });

  console.log(data);

  return (
    <Layout>
      <Link>
        <NextLink href="/create-post">create Post</NextLink>
      </Link>
      <br />
      {!data ? (
        <div>loading...</div>
      ) : (
        data.posts.map((post) => <p key={post.id}>{post.title}</p>)
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
