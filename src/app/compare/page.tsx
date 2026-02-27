import { notFound, redirect } from "next/navigation";
import { getClient } from "@/lib/apollo-server";
import { GET_POKEMON_DETAIL } from "@/graphql/queries/getPokemonDetail";
import type {
  GetPokemonDetailData,
  GetPokemonDetailVars,
  GqlPokemonDetail,
} from "@/types/pokemon";
import PokemonCompareView from "@/components/page/compare/PokemonCompareView";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: PageProps) {
  const params = await searchParams;
  const p1 = params["p1"];
  const p2 = params["p2"];
  return {
    title: `Compare #${p1} vs #${p2} | Pokédex`,
    description: `Compare stats, types, and sizes side-by-side`,
  };
}

export default async function ComparePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const p1Id = parseInt(String(params["p1"]), 10);
  const p2Id = parseInt(String(params["p2"]), 10);

  if (isNaN(p1Id) || isNaN(p2Id) || p1Id < 1 || p2Id < 1) {
    redirect("/");
  }

  const client = getClient();

  const [res1, res2] = await Promise.all([
    client.query<GetPokemonDetailData, GetPokemonDetailVars>({
      query: GET_POKEMON_DETAIL,
      variables: { id: p1Id },
    }),
    client.query<GetPokemonDetailData, GetPokemonDetailVars>({
      query: GET_POKEMON_DETAIL,
      variables: { id: p2Id },
    }),
  ]);

  const p1Data: GqlPokemonDetail | undefined = res1.data?.pokemon_v2_pokemon[0];
  const p2Data: GqlPokemonDetail | undefined = res2.data?.pokemon_v2_pokemon[0];

  if (!p1Data || !p2Data) {
    notFound();
  }

  return <PokemonCompareView p1={p1Data} p2={p2Data} />;
}
