import { gql } from "@apollo/client";

export const GET_POKEMON_LIST = gql`
  query GetPokemonList($limit: Int = 10, $offset: Int = 0) {
    pokemon_v2_pokemon(limit: $limit, offset: $offset, order_by: { id: asc }) {
      id
      name
      pokemon_v2_pokemontypes {
        pokemon_v2_type {
          name
        }
      }
      pokemon_v2_pokemonsprites {
        sprites
      }
    }
    pokemon_v2_pokemon_aggregate {
      aggregate {
        count
      }
    }
  }
`;
