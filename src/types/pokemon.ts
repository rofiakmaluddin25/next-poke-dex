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

export interface PokemonCardData {
  id: number;
  name: string;
  image: string;
  types: PokemonTypeName[];
}

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
  name?: string;
}

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

export interface GqlPokemonStat {
  base_stat: number;
  pokemon_v2_stat: {
    name: string;
  };
}

export interface GqlPokemonAbility {
  is_hidden: boolean;
  pokemon_v2_ability: {
    name: string;
  };
}

export interface GqlEvolutionSpecies {
  id: number;
  name: string;
  evolves_from_species_id: number | null;
  pokemon_v2_pokemonevolutions: { min_level: number | null }[];
}

export interface GqlPokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  pokemon_v2_pokemontypes: {
    pokemon_v2_type: { name: PokemonTypeName };
  }[];
  pokemon_v2_pokemonsprites: { sprites: PokemonSprites }[];
  pokemon_v2_pokemonstats: GqlPokemonStat[];
  pokemon_v2_pokemonabilities: GqlPokemonAbility[];
  pokemon_v2_pokemonspecy: {
    capture_rate: number;
    base_happiness: number;
    pokemon_v2_pokemonspeciesflavortexts: { flavor_text: string }[];
    pokemon_v2_pokemonspeciesnames: { genus: string }[];
    pokemon_v2_evolutionchain: {
      pokemon_v2_pokemonspecies: GqlEvolutionSpecies[];
    };
  } | null;
}

export interface GqlTypeEfficacy {
  damage_factor: number;
  pokemon_v2_type: { name: PokemonTypeName };
  pokemonV2TypeByTargetTypeId: { name: PokemonTypeName };
}

export interface GetPokemonDetailData {
  pokemon_v2_pokemon: GqlPokemonDetail[];
  pokemon_v2_typeefficacy: GqlTypeEfficacy[];
}

export interface GetPokemonDetailVars {
  id: number;
}
