import React from "react";
import { Box, Button, Flex, Heading, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { useApolloClient } from "@apollo/client";

interface NavbarProps {}

export const NavBar: React.FC<NavbarProps> = () => {
  const [logout, { loading: logoutFetching }] = useLogoutMutation();
  const { data, loading } = useMeQuery({
    skip: isServer(), // to avoid making extra requests on ssr
  });
  const apolloClient = useApolloClient();

  console.log(data);

  let body = null;
  // data is loading
  if (loading) {
    // user not logged in
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href={"/login"}>
          <Link mr={2}>login</Link>
        </NextLink>
        <NextLink href={"/register"}>
          <Link>register</Link>
        </NextLink>
      </>
    );
    // user is logged in
  } else {
    body = (
      <>
        <NextLink href="/create-post">
          <Button as={Link} ml="auto" mr={4}>
            create post
          </Button>
        </NextLink>
        <Box mr={2}>{data.me.username}</Box>
        <Button
          variant="link"
          onClick={async () => {
            await logout();
            await apolloClient.resetStore();
          }}
          isLoading={logoutFetching}
        >
          logout
        </Button>
      </>
    );
  }

  return (
    <Flex
      zIndex={1}
      position="sticky"
      top={0}
      bg="tan"
      p={4}
      ml="auto"
      alignItems="center"
    >
      <Flex maxW="800" flex={1} margin="auto">
        <NextLink href="/">
          <Link>
            <Heading>LiReddit</Heading>
          </Link>
        </NextLink>
        <Flex ml="auto" align="center">
          {body}
        </Flex>
      </Flex>
    </Flex>
  );
};
