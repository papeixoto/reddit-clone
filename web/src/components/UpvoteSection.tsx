import { FC, useState } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton, Text } from "@chakra-ui/react";
import {
  PostSnippetFragment,
  useVoteMutation,
  VoteMutation,
} from "../generated/graphql";
import gql from "graphql-tag";
import { ApolloCache } from "@apollo/client";

interface Props {
  post: PostSnippetFragment;
}

const updateAfterVote = (
  value: number,
  postId: number,
  cache: ApolloCache<VoteMutation>
) => {
  const data = cache.readFragment<{
    id: number;
    points: number;
    voteStatus: number | null;
  }>({
    id: "Post:" + postId,
    fragment: gql`
      fragment _ on Post {
        id
        points
        voteStatus
      }
    `,
  });

  if (data) {
    if (data.voteStatus === value) {
      return;
    }
    const newPoints =
      (data.points as number) + (!data.voteStatus ? 1 : 2) * value;

    cache.writeFragment({
      id: "Post" + postId,
      fragment: gql`
        fragment _ on Post {
          points
          voteStatus
        }
      `,
      data: { points: newPoints, voteStatus: value },
    });
  }
};

export const UpvoteSection: FC<Props> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    "upvoting" | "downvoting" | null
  >();
  const [vote] = useVoteMutation();
  return (
    <Flex direction="column" alignItems="center" justifyContent="center" mr={4}>
      <IconButton
        icon={<ChevronUpIcon />}
        aria-label="upvote post"
        onClick={async () => {
          if (post.voteStatus === 1) {
            return;
          }
          setLoadingState("upvoting");
          await vote({
            variables: { postId: post.id, value: 1 },
            update: (cache) => updateAfterVote(1, post.id, cache),
          });
          setLoadingState(null);
        }}
        isLoading={loadingState === "upvoting"}
        colorScheme={post.voteStatus === 1 ? "green" : undefined}
      />
      <Text>{post.points}</Text>
      <IconButton
        icon={<ChevronDownIcon />}
        aria-label="downvote post"
        onClick={async () => {
          if (post.voteStatus === -1) {
            return;
          }
          setLoadingState("downvoting");
          await vote({
            variables: { postId: post.id, value: -1 },
            update: (cache) => updateAfterVote(-1, post.id, cache),
          });
          setLoadingState(null);
        }}
        isLoading={loadingState === "downvoting"}
        colorScheme={post.voteStatus === -1 ? "red" : undefined}
      />
    </Flex>
  );
};
