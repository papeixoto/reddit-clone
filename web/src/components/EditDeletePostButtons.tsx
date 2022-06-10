import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { Box, IconButton } from "@chakra-ui/react";
import NextLink from "next/link";
import { useDeletePostMutation } from "../generated/graphql";

interface EditDeletePostButtonProps {
  id: number;
}

export const EditDeletePostButtons = ({ id }: EditDeletePostButtonProps) => {
  const [deletePost] = useDeletePostMutation();

  return (
    <Box>
      <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
        <IconButton
          ml="auto"
          icon={<EditIcon />}
          aria-label="edit post"
          mr={4}
        />
      </NextLink>
      <IconButton
        ml="auto"
        icon={<DeleteIcon />}
        aria-label="delete post"
        onClick={() => {
          deletePost({
            variables: { id },
            update: (cache) => {
              cache.evict({ id: "Post:" + id });
            },
          });
        }}
      />
    </Box>
  );
};
