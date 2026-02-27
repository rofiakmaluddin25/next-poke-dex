"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import { Search, X, ArrowUpDown } from "lucide-react";
import { GET_POKEMON_LIST } from "@/graphql/queries/getPokemonList";
import type {
  GetPokemonListData,
  GetPokemonListVars,
  PokemonTypeName,
} from "@/types/pokemon";
import { toPokemonCardData } from "@/types/pokemon";
import PokemonCard from "@/components/page/PokemonCard";
import PokemonCardSkeleton from "@/components/page/PokemonCardSkeleton";
import PokemonPagination from "@/components/page/PokemonPagination";

const ITEMS_PER_PAGE = 10;

const ALL_TYPES: PokemonTypeName[] = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
];

const TYPE_PILL_STYLE: Record<PokemonTypeName, { bg: string; text: string }> = {
  normal: { bg: "#A8A878", text: "#2a2a1a" },
  fire: { bg: "#F08030", text: "#fff" },
  water: { bg: "#6890F0", text: "#fff" },
  electric: { bg: "#F8D030", text: "#2a2a00" },
  grass: { bg: "#78C850", text: "#fff" },
  ice: { bg: "#98D8D8", text: "#003030" },
  fighting: { bg: "#C03028", text: "#fff" },
  poison: { bg: "#A040A0", text: "#fff" },
  ground: { bg: "#E0C068", text: "#2a1a00" },
  flying: { bg: "#A890F0", text: "#fff" },
  psychic: { bg: "#F85888", text: "#fff" },
  bug: { bg: "#A8B820", text: "#fff" },
  rock: { bg: "#B8A038", text: "#fff" },
  ghost: { bg: "#705898", text: "#fff" },
  dragon: { bg: "#7038F8", text: "#fff" },
  dark: { bg: "#705848", text: "#fff" },
  steel: { bg: "#B8B8D0", text: "#2a2a3a" },
  fairy: { bg: "#EE99AC", text: "#3a0020" },
};

const SORT_OPTIONS: Record<
  string,
  { label: string; value: Record<string, "asc" | "desc">[] }
> = {
  "id-asc": { label: "#: Low → High", value: [{ id: "asc" }] },
  "id-desc": { label: "#: High → Low", value: [{ id: "desc" }] },
  "name-asc": { label: "Name: A → Z", value: [{ name: "asc" }] },
  "name-desc": { label: "Name: Z → A", value: [{ name: "desc" }] },
};

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
  const [selectedType, setSelectedType] = useState<PokemonTypeName | null>(
    null,
  );
  const [sortOrder, setSortOrder] = useState<string>("id-asc");
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const debouncedSearch = useDebounce(searchInput, 400);

  const nameVar = debouncedSearch ? `%${debouncedSearch}%` : "%";
  const typeVar = selectedType ?? "%";
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const { data, loading } = useQuery<GetPokemonListData, GetPokemonListVars>(
    GET_POKEMON_LIST,
    {
      variables: {
        limit: ITEMS_PER_PAGE,
        offset,
        name: nameVar,
        type: typeVar,
        order_by: SORT_OPTIONS[sortOrder].value,
      },
    },
  );

  const pokemons = data?.pokemon_v2_pokemon.map(toPokemonCardData) ?? [];
  const totalCount = data?.pokemon_v2_pokemon_aggregate.aggregate.count ?? 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const handleClear = () => setSearchInput("");

  const handleTypeToggle = (type: PokemonTypeName) => {
    setSelectedType((prev) => (prev === type ? null : type));
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
    setCurrentPage(1);
  };

  const handleToggleCompareMode = () => {
    setIsCompareMode(!isCompareMode);
    if (isCompareMode) {
      setSelectedIds([]);
    }
  };

  const handleCardToggle = (id: number) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((p) => p !== id);
      }
      if (prev.length >= 2) {
        return [prev[1], id];
      }
      return [...prev, id];
    });
  };

  const hasActiveFilter =
    !!selectedType || !!debouncedSearch || sortOrder !== "id-asc";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto mb-6 flex max-w-2xl flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-white/40"
            aria-hidden="true"
          />
          <input
            id="pokemon-search"
            type="search"
            value={searchInput}
            onChange={handleSearchChange}
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

        <div className="flex shrink-0 gap-3 sm:w-auto">
          <div className="relative w-full sm:w-48">
            <ArrowUpDown
              className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-white/40"
              aria-hidden="true"
            />
            <select
              value={sortOrder}
              onChange={handleSortChange}
              aria-label="Sort Pokémon"
              className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 py-2.5 pr-10 pl-10 text-sm text-white transition-all duration-200 outline-none focus:border-blue-500/60 focus:bg-white/8 focus:ring-2 focus:ring-blue-500/20"
            >
              {Object.entries(SORT_OPTIONS).map(([key, { label }]) => (
                <option
                  key={key}
                  value={key}
                  className="bg-[#1a1a2e] text-white"
                >
                  {label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute top-1/2 right-3.5 flex -translate-y-1/2 items-center text-white/40">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          <button
            onClick={handleToggleCompareMode}
            className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
              isCompareMode
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            {isCompareMode ? "Done" : "Compare"}
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div
          className="flex flex-wrap justify-center gap-2"
          role="group"
          aria-label="Filter by Pokémon type"
        >
          {ALL_TYPES.map((type) => {
            const isActive = selectedType === type;
            const { bg, text } = TYPE_PILL_STYLE[type];
            return (
              <button
                key={type}
                onClick={() => handleTypeToggle(type)}
                aria-pressed={isActive}
                className="rounded-full px-3.5 py-1 text-[11px] font-bold tracking-widest uppercase transition-all duration-200"
                style={
                  isActive
                    ? {
                        backgroundColor: bg,
                        color: text,
                        boxShadow: `0 0 10px ${bg}66`,
                      }
                    : {
                        backgroundColor: `${bg}22`,
                        color: bg,
                        border: `1px solid ${bg}44`,
                      }
                }
              >
                {type}
              </button>
            );
          })}
        </div>

        {hasActiveFilter && (
          <div className="mt-3 flex items-center justify-center gap-3">
            <p className="text-sm text-white/40">
              {totalCount === 0 ? "No Pokémon match" : `${totalCount} Pokémon`}
              {selectedType && (
                <>
                  {" "}
                  · <span className="capitalize">{selectedType}</span>
                </>
              )}
              {debouncedSearch && <> · &quot;{debouncedSearch}&quot;</>}
            </p>
            <button
              onClick={() => {
                setSelectedType(null);
                setSearchInput("");
                setSortOrder("id-asc");
                setCurrentPage(1);
              }}
              className="text-xs text-white/30 underline underline-offset-2 transition hover:text-white/70"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {loading
          ? Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <PokemonCardSkeleton key={i} />
            ))
          : pokemons.map((pokemon) => (
              <PokemonCard
                key={pokemon.id}
                {...pokemon}
                href={isCompareMode ? undefined : `/pokemon/${pokemon.id}`}
                selectable={isCompareMode}
                selected={selectedIds.includes(pokemon.id)}
                onToggle={() => handleCardToggle(pokemon.id)}
              />
            ))}
      </div>

      {!loading && pokemons.length === 0 && (
        <div className="mt-16 flex flex-col items-center gap-3 text-center">
          <span className="text-5xl">😕</span>
          <p className="text-lg font-semibold text-white/60">
            No Pokémon found
          </p>
          <p className="text-sm text-white/30">
            Try a different name or type filter.
          </p>
        </div>
      )}

      <PokemonPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {isCompareMode && selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 z-50 flex w-full max-w-md -translate-x-1/2 items-center justify-between rounded-2xl border border-white/10 bg-[#1a1a2e]/95 p-4 shadow-2xl shadow-black/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="text-sm font-medium text-white/50">
              <span className="text-white">{selectedIds.length}</span>/2
            </div>
            <div className="flex gap-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-10 w-10 rounded-full border-2 ${
                    selectedIds[i]
                      ? "border-blue-500 bg-blue-500/20"
                      : "border-white/10 bg-white/5"
                  } flex items-center justify-center`}
                >
                  {selectedIds[i] && (
                    <span className="text-[10px] text-white">
                      #{selectedIds[i]}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Link
            href={
              selectedIds.length === 2
                ? `/compare?p1=${selectedIds[0]}&p2=${selectedIds[1]}`
                : "#"
            }
            className={`rounded-xl px-6 py-2.5 text-sm font-bold transition-all duration-200 ${
              selectedIds.length === 2
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25 hover:bg-blue-500"
                : "cursor-not-allowed bg-white/10 text-white/40"
            }`}
            onClick={(e) => {
              if (selectedIds.length !== 2) e.preventDefault();
            }}
          >
            Compare Now
          </Link>
        </div>
      )}
    </div>
  );
}
