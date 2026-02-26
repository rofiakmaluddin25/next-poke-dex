import { getClient } from "@/lib/apollo-server";
import { GET_POKEMON_LIST } from "@/graphql/queries/getPokemonList";
import type { GetPokemonListData, GetPokemonListVars } from "@/types/pokemon";
import { toPokemonCardData } from "@/types/pokemon";
import PokemonCard from "@/components/page/PokemonCard";
import PokemonPagination from "@/components/page/PokemonPagination";

const ITEMS_PER_PAGE = 10;

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function PokeList({ searchParams }: PageProps) {
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam ?? "1", 10));
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const { data } = await getClient().query<
    GetPokemonListData,
    GetPokemonListVars
  >({
    query: GET_POKEMON_LIST,
    variables: { limit: ITEMS_PER_PAGE, offset },
  });

  const pokemons = data?.pokemon_v2_pokemon.map(toPokemonCardData) ?? [];
  const totalCount = data?.pokemon_v2_pokemon_aggregate.aggregate.count ?? 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {pokemons.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            {...pokemon}
            href={`/pokemon/${pokemon.id}`}
          />
        ))}
      </div>

      <PokemonPagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
