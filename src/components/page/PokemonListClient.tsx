"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { Search, X } from "lucide-react";
import { GET_POKEMON_LIST } from "@/graphql/queries/getPokemonList";
import type { GetPokemonListData, GetPokemonListVars } from "@/types/pokemon";
import { toPokemonCardData } from "@/types/pokemon";
import PokemonCard from "@/components/page/PokemonCard";
import PokemonCardSkeleton from "@/components/page/PokemonCardSkeleton";
import PokemonPagination from "@/components/page/PokemonPagination";

const ITEMS_PER_PAGE = 10;

function useDebounce(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function PokemonListClient() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 400);

  const nameVar = debouncedSearch ? `%${debouncedSearch}%` : "%";
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const { data, loading } = useQuery<GetPokemonListData, GetPokemonListVars>(
    GET_POKEMON_LIST,
    { variables: { limit: ITEMS_PER_PAGE, offset, name: nameVar } },
  );

  const pokemons = data?.pokemon_v2_pokemon.map(toPokemonCardData) ?? [];
  const totalCount = data?.pokemon_v2_pokemon_aggregate.aggregate.count ?? 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const handleClear = () => setSearchInput("");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="relative mx-auto mb-8 max-w-md">
        <Search
          className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-white/40"
          aria-hidden="true"
        />
        <input
          id="pokemon-search"
          type="search"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search Pokémon by name…"
          aria-label="Search Pokémon by name"
          className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pr-10 pl-10 text-sm text-white placeholder-white/30 transition-all duration-200 outline-none focus:border-blue-500/60 focus:bg-white/8 focus:ring-2 focus:ring-blue-500/20"
        />
        {searchInput && (
          <button
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute top-1/2 right-3 -translate-y-1/2 rounded p-0.5 text-white/40 transition hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {debouncedSearch && !loading && (
        <p className="mb-4 text-sm text-white/40">
          {totalCount === 0
            ? `No Pokémon found for "${debouncedSearch}"`
            : `${totalCount} result${totalCount !== 1 ? "s" : ""} for "${debouncedSearch}"`}
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {loading
          ? Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
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

      {!loading && pokemons.length === 0 && debouncedSearch && (
        <div className="mt-16 flex flex-col items-center gap-3 text-center">
          <span className="text-5xl">😕</span>
          <p className="text-lg font-semibold text-white/60">
            No Pokémon found
          </p>
          <p className="text-sm text-white/30">
            Try a different name, e.g.{" "}
            <button
              onClick={() => setSearchInput("char")}
              className="text-blue-400 underline underline-offset-2 hover:text-blue-300"
            >
              char
            </button>
          </p>
        </div>
      )}

      <PokemonPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
