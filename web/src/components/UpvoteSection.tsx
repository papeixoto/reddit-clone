import { FC, useState } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton, Text } from "@chakra-ui/react";
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql";

interface Props {
  post: PostSnippetFragment;
}

export const UpvoteSection: FC<Props> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    "upvoting" | "downvoting" | null
  >();
  const [, vote] = useVoteMutation();
  return (
    <Flex direction="column" alignItems="center" justifyContent="center" mr={4}>
      <IconButton
        icon={<ChevronUpIcon />}
        aria-label="upvote post"
        onClick={async () => {
          setLoadingState("upvoting");
          await vote({ postId: post.id, value: 1 });
          setLoadingState(null);
        }}
        isLoading={loadingState === "upvoting"}
      />
      <Text>{post.points}</Text>
      <IconButton
        icon={<ChevronDownIcon />}
        aria-label="downvote post"
        onClick={async () => {
          setLoadingState("downvoting");
          await vote({ postId: post.id, value: -1 });
          setLoadingState(null);
        }}
        isLoading={loadingState === "downvoting"}
      />
    </Flex>
  );
};
