export type PokemonTypeName =
  | "normal"
  | "fire"
  | "water"
  | "electric"
  | "grass"
  | "ice"
  | "fighting"
  | "poison"
  | "ground"
  | "flying"
  | "psychic"
  | "bug"
  | "rock"
  | "ghost"
  | "dragon"
  | "dark"
  | "steel"
  | "fairy";

// ── UI / component shape ──────────────────────────────────────────────────────

export interface PokemonCardData {
  id: number;
  name: string;
  image: string;
  types: PokemonTypeName[];
}

// ── Raw GraphQL response shapes ───────────────────────────────────────────────
// These mirror the exact JSON returned by the PokeAPI v1beta GraphQL endpoint.

interface PokemonSprites {
  other: {
    "official-artwork": {
      front_default: string | null;
    };
    home?: {
      front_default: string | null;
    };
    dream_world?: {
      front_default: string | null;
    };
  };
  front_default: string | null;
  back_default: string | null;
}

export interface GqlPokemon {
  id: number;
  name: string;
  pokemon_v2_pokemontypes: {
    pokemon_v2_type: {
      name: PokemonTypeName;
    };
  }[];
  pokemon_v2_pokemonsprites: {
    sprites: PokemonSprites;
  }[];
}

export interface GetPokemonListData {
  pokemon_v2_pokemon: GqlPokemon[];
  pokemon_v2_pokemon_aggregate: {
    aggregate: {
      count: number;
    };
  };
}

export interface GetPokemonListVars {
  limit?: number;
  offset?: number;
}

// ── Transformer ───────────────────────────────────────────────────────────────
// Converts a raw GqlPokemon into the clean PokemonCardData used by the UI.

export function toPokemonCardData(pokemon: GqlPokemon): PokemonCardData {
  const sprites = pokemon.pokemon_v2_pokemonsprites[0]?.sprites;
  const image =
    sprites?.other["official-artwork"]?.front_default ??
    sprites?.front_default ??
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

  return {
    id: pokemon.id,
    name: pokemon.name,
    image,
    types: pokemon.pokemon_v2_pokemontypes.map((t) => t.pokemon_v2_type.name),
  };
}
