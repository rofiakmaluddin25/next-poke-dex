import { notFound } from "next/navigation";
import { getClient } from "@/lib/apollo-server";
import { GET_POKEMON_DETAIL } from "@/graphql/queries/getPokemonDetail";
import type {
  GetPokemonDetailData,
  GetPokemonDetailVars,
  GqlPokemonDetail,
  GqlTypeEfficacy,
} from "@/types/pokemon";
import PokemonDetailView from "@/components/page/detail/PokemonDetailView";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  return {
    title: `Pokémon #${id} | Pokédex`,
    description: `View stats, evolution, moves and more for Pokémon #${id}`,
  };
}

export default async function PokemonDetailPage({ params }: PageProps) {
  const { id } = await params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId) || numericId < 1) notFound();

  const { data } = await getClient().query<
    GetPokemonDetailData,
    GetPokemonDetailVars
  >({
    query: GET_POKEMON_DETAIL,
    variables: { id: numericId },
  });

  const pokemon: GqlPokemonDetail | undefined = data?.pokemon_v2_pokemon[0];
  if (!pokemon) notFound();

  const typeEfficacy: GqlTypeEfficacy[] = data?.pokemon_v2_typeefficacy ?? [];

  return <PokemonDetailView pokemon={pokemon} typeEfficacy={typeEfficacy} />;
}
