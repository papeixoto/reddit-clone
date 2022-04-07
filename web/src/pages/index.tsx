import { withUrqlClient } from "next-urql";
import { NavBar } from "../components/NavBar";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => {
  const [{ data }] = usePostsQuery();

  console.log(data);

  return (
    <>
      <NavBar />
      <div>Hello world</div>
      <hr />
      {!data ? (
        <div>loading...</div>
      ) : (
        data.posts.map((post) => <p key={post.id}>{post.title}</p>)
      )}
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
