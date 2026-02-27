import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { GqlPokemonDetail, PokemonTypeName } from "@/types/pokemon";
import { TYPE_COLORS } from "@/components/page/detail/PokemonDetailView";

const STAT_LABEL: Record<string, string> = {
  hp: "HP",
  attack: "ATK",
  defense: "DEF",
  "special-attack": "SP. ATK",
  "special-defense": "SP. DEF",
  speed: "SPD",
};

const STAT_MAX: Record<string, number> = {
  hp: 266,
  attack: 293,
  defense: 280,
  "special-attack": 348,
  "special-defense": 295,
  speed: 328,
};

interface Props {
  p1: GqlPokemonDetail;
  p2: GqlPokemonDetail;
}

export default function PokemonCompareView({ p1, p2 }: Props) {
  const p1Image =
    p1.pokemon_v2_pokemonsprites[0]?.sprites?.other?.["official-artwork"]
      ?.front_default ??
    p1.pokemon_v2_pokemonsprites[0]?.sprites?.front_default ??
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p1.id}.png`;

  const p2Image =
    p2.pokemon_v2_pokemonsprites[0]?.sprites?.other?.["official-artwork"]
      ?.front_default ??
    p2.pokemon_v2_pokemonsprites[0]?.sprites?.front_default ??
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p2.id}.png`;

  const p1Types = p1.pokemon_v2_pokemontypes.map((t) => t.pokemon_v2_type.name);
  const p2Types = p2.pokemon_v2_pokemontypes.map((t) => t.pokemon_v2_type.name);

  const p1PrimaryColor = TYPE_COLORS[p1Types[0]] ?? "#6890F0";
  const p2PrimaryColor = TYPE_COLORS[p2Types[0]] ?? "#6890F0";

  const p1HeightM = (p1.height / 10).toFixed(1);
  const p1WeightKg = (p1.weight / 10).toFixed(1);
  const p2HeightM = (p2.height / 10).toFixed(1);
  const p2WeightKg = (p2.weight / 10).toFixed(1);

  const statsList = p1.pokemon_v2_pokemonstats.map(
    (s) => s.pokemon_v2_stat.name,
  );

  return (
    <div className="min-h-screen bg-[#0d0d1a] text-white">
      <div className="mx-auto max-w-7xl px-4 pt-6 pb-2 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Pokédex
        </Link>
      </div>

      <div className="mx-auto max-w-5xl px-4 pt-8 pb-16 sm:px-6 lg:px-8">
        <h1 className="mb-12 text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Head-to-Head Comparison
        </h1>

        <div className="rounded-3xl border border-white/5 bg-[#1a1a2e] p-6 shadow-xl sm:p-10">
          <div className="mb-12 grid grid-cols-2 gap-8">
            <PokemonProfileCard
              pokemon={p1}
              image={p1Image}
              types={p1Types}
              primaryColor={p1PrimaryColor}
            />
            <PokemonProfileCard
              pokemon={p2}
              image={p2Image}
              types={p2Types}
              primaryColor={p2PrimaryColor}
            />
          </div>

          <hr className="mb-10 border-white/10" />

          <div className="mb-10 flex flex-col gap-6">
            <h3 className="text-center text-xs font-bold tracking-widest text-white/50 uppercase">
              Physical Specs
            </h3>
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6">
              <div className="text-right">
                <p className="text-xl font-bold">{p1HeightM} m</p>
                <p className="text-xs text-white/50">{p1WeightKg} kg</p>
              </div>
              <div className="w-16 text-center text-[10px] font-bold tracking-widest text-white/30 uppercase">
                Height
                <br />
                Weight
              </div>
              <div className="text-left">
                <p className="text-xl font-bold">{p2HeightM} m</p>
                <p className="text-xs text-white/50">{p2WeightKg} kg</p>
              </div>
            </div>
          </div>

          <hr className="mb-10 border-white/10" />

          <div>
            <h3 className="mb-8 text-center text-xs font-bold tracking-widest text-white/50 uppercase">
              Base Stats
            </h3>

            <div className="flex flex-col gap-5">
              {statsList.map((statName) => {
                const label = STAT_LABEL[statName] ?? statName.toUpperCase();
                const max = STAT_MAX[statName] ?? 300;

                const p1Stat =
                  p1.pokemon_v2_pokemonstats.find(
                    (s) => s.pokemon_v2_stat.name === statName,
                  )?.base_stat ?? 0;

                const p2Stat =
                  p2.pokemon_v2_pokemonstats.find(
                    (s) => s.pokemon_v2_stat.name === statName,
                  )?.base_stat ?? 0;

                const p1Pct = Math.min((p1Stat / max) * 100, 100);
                const p2Pct = Math.min((p2Stat / max) * 100, 100);

                return (
                  <div
                    key={statName}
                    className="grid grid-cols-[1fr_80px_1fr] items-center gap-4 md:grid-cols-[1fr_100px_1fr]"
                  >
                    <div className="flex items-center justify-end gap-3">
                      <span className="w-8 text-right text-sm font-semibold text-white/90">
                        {p1Stat}
                      </span>
                      <div className="flex h-2 w-full max-w-[200px] justify-end overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: `${p1Pct}%`,
                            backgroundColor:
                              p1Stat > p2Stat ? p1PrimaryColor : "#4a4a6a",
                            opacity: p1Stat > p2Stat ? 1 : 0.6,
                          }}
                        />
                      </div>
                    </div>

                    <div className="text-center">
                      <span className="text-[10px] font-bold tracking-wider whitespace-nowrap text-white/50">
                        {label}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="h-2 w-full max-w-[200px] overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: `${p2Pct}%`,
                            backgroundColor:
                              p2Stat > p1Stat ? p2PrimaryColor : "#4a4a6a",
                            opacity: p2Stat > p1Stat ? 1 : 0.6,
                          }}
                        />
                      </div>
                      <span className="w-8 text-left text-sm font-semibold text-white/90">
                        {p2Stat}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PokemonProfileCard({
  pokemon,
  image,
  types,
  primaryColor,
}: {
  pokemon: GqlPokemonDetail;
  image: string;
  types: PokemonTypeName[];
  primaryColor: string;
}) {
  const formattedId = `#${String(pokemon.id).padStart(3, "0")}`;

  return (
    <div className="group flex flex-col items-center">
      <Link href={`/pokemon/${pokemon.id}`} className="relative mb-4 block">
        <div
          className="relative flex h-32 w-32 items-center justify-center rounded-3xl transition-transform duration-300 group-hover:scale-[1.03] sm:h-48 sm:w-48"
          style={{
            background: `radial-gradient(ellipse at 50% 50%, ${primaryColor}33 0%, transparent 70%)`,
          }}
        >
          <Image
            src={image}
            alt={pokemon.name}
            fill
            sizes="192px"
            className="object-contain p-2 drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)]"
          />
        </div>
      </Link>
      <p className="mb-1 text-xs font-semibold text-white/40">{formattedId}</p>
      <Link href={`/pokemon/${pokemon.id}`}>
        <h2 className="text-xl font-bold capitalize decoration-white/20 underline-offset-4 hover:underline sm:text-2xl">
          {pokemon.name}
        </h2>
      </Link>
      <div className="mt-3 flex flex-wrap justify-center gap-1.5">
        {types.map((t) => (
          <span
            key={t}
            className="rounded-full px-3 py-0.5 text-[10px] font-bold tracking-widest text-white uppercase"
            style={{ backgroundColor: TYPE_COLORS[t] }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
