import { gql } from "@apollo/client";

export const GET_POKEMON_LIST = gql`
  query GetPokemonList(
    $limit: Int = 10
    $offset: Int = 0
    $name: String = "%"
    $type: String = "%"
  ) {
    pokemon_v2_pokemon(
      limit: $limit
      offset: $offset
      order_by: { id: asc }
      where: {
        name: { _ilike: $name }
        pokemon_v2_pokemontypes: {
          pokemon_v2_type: { name: { _ilike: $type } }
        }
      }
    ) {
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
    pokemon_v2_pokemon_aggregate(
      where: {
        name: { _ilike: $name }
        pokemon_v2_pokemontypes: {
          pokemon_v2_type: { name: { _ilike: $type } }
        }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;
