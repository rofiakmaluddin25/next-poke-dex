import { gql } from "@apollo/client";

export const GET_POKEMON_DETAIL = gql`
  query GetPokemonDetail($id: Int!) {
    pokemon_v2_pokemon(where: { id: { _eq: $id } }) {
      id
      name
      height
      weight
      pokemon_v2_pokemontypes {
        pokemon_v2_type {
          name
        }
      }
      pokemon_v2_pokemonsprites {
        sprites
      }
      pokemon_v2_pokemonstats {
        base_stat
        pokemon_v2_stat {
          name
        }
      }
      pokemon_v2_pokemonabilities(order_by: { slot: asc }) {
        is_hidden
        pokemon_v2_ability {
          name
        }
      }
      pokemon_v2_pokemonspecy {
        capture_rate
        base_happiness
        pokemon_v2_pokemonspeciesflavortexts(
          where: { language_id: { _eq: 9 } }
          limit: 1
        ) {
          flavor_text
        }
        pokemon_v2_pokemonspeciesnames(where: { language_id: { _eq: 9 } }) {
          genus
        }
        pokemon_v2_evolutionchain {
          pokemon_v2_pokemonspecies(order_by: { order: asc }) {
            id
            name
            evolves_from_species_id
            pokemon_v2_pokemonevolutions {
              min_level
            }
          }
        }
      }
    }
    pokemon_v2_typeefficacy {
      damage_factor
      pokemon_v2_type {
        name
      }
      pokemonV2TypeByTargetTypeId {
        name
      }
    }
  }
`;
