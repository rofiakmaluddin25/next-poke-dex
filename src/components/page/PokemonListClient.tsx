"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_POKEMON_LIST } from "@/graphql/queries/getPokemonList";
import type { GetPokemonListData, GetPokemonListVars } from "@/types/pokemon";
import { toPokemonCardData } from "@/types/pokemon";
import PokemonCard from "@/components/page/PokemonCard";
import PokemonCardSkeleton from "@/components/page/PokemonCardSkeleton";
import PokemonPagination from "@/components/page/PokemonPagination";

const ITEMS_PER_PAGE = 10;
const SKELETON_COUNT = ITEMS_PER_PAGE;

export default function PokemonListClient() {
  const [currentPage, setCurrentPage] = useState(1);
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const { data, loading } = useQuery<GetPokemonListData, GetPokemonListVars>(
    GET_POKEMON_LIST,
    { variables: { limit: ITEMS_PER_PAGE, offset } },
  );

  const pokemons = data?.pokemon_v2_pokemon.map(toPokemonCardData) ?? [];
  const totalCount = data?.pokemon_v2_pokemon_aggregate.aggregate.count ?? 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {loading
          ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <PokemonCardSkeleton key={i} />
            ))
          : pokemons.map((pokemon) => (
              <PokemonCard
                key={pokemon.id}
                {...pokemon}
                href={`/pokemon/${pokemon.id}`}
              />
            ))}
      </div>

      <PokemonPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
