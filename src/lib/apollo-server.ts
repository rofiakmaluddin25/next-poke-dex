import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

export const getClient = () => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: "https://beta.pokeapi.co/graphql/v1beta",
      fetchOptions: { cache: "no-store" },
    }),
  });
};
