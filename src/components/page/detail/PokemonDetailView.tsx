import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type {
  GqlPokemonDetail,
  GqlTypeEfficacy,
  PokemonTypeName,
} from "@/types/pokemon";
import StatBar from "./StatBar";
import EvolutionChain from "./EvolutionChain";
import TypeDefenses from "./TypeDefenses";

export const TYPE_COLORS: Record<PokemonTypeName, string> = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
};

export const TYPE_BG: Record<PokemonTypeName, string> = {
  normal: "bg-[#A8A878]",
  fire: "bg-[#F08030]",
  water: "bg-[#6890F0]",
  electric: "bg-[#F8D030]",
  grass: "bg-[#78C850]",
  ice: "bg-[#98D8D8]",
  fighting: "bg-[#C03028]",
  poison: "bg-[#A040A0]",
  ground: "bg-[#E0C068]",
  flying: "bg-[#A890F0]",
  psychic: "bg-[#F85888]",
  bug: "bg-[#A8B820]",
  rock: "bg-[#B8A038]",
  ghost: "bg-[#705898]",
  dragon: "bg-[#7038F8]",
  dark: "bg-[#705848]",
  steel: "bg-[#B8B8D0]",
  fairy: "bg-[#EE99AC]",
};

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
  pokemon: GqlPokemonDetail;
  typeEfficacy: GqlTypeEfficacy[];
}

export default function PokemonDetailView({ pokemon, typeEfficacy }: Props) {
  const specyData = pokemon.pokemon_v2_pokemonspecy;
  const sprites = pokemon.pokemon_v2_pokemonsprites[0]?.sprites;
  const image =
    sprites?.other?.["official-artwork"]?.front_default ??
    sprites?.front_default ??
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

  const types = pokemon.pokemon_v2_pokemontypes.map(
    (t) => t.pokemon_v2_type.name,
  );
  const primaryType = types[0];
  const primaryColor = TYPE_COLORS[primaryType] ?? "#6890F0";

  const abilities = pokemon.pokemon_v2_pokemonabilities;
  const abilityLabel = abilities
    .filter((a) => !a.is_hidden)
    .map((a) =>
      a.pokemon_v2_ability.name
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()),
    )
    .join(", ");

  const hiddenAbility = abilities.find((a) => a.is_hidden);
  const hiddenAbilityLabel = hiddenAbility
    ? hiddenAbility.pokemon_v2_ability.name
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : null;

  const catchRate = specyData?.capture_rate ?? 0;
  const catchRatePct = ((catchRate / 255) * 100).toFixed(1);
  const flavorText =
    specyData?.pokemon_v2_pokemonspeciesflavortexts[0]?.flavor_text?.replace(
      /[\n\f]/g,
      " ",
    ) ?? "";
  const genus =
    specyData?.pokemon_v2_pokemonspeciesnames[0]?.genus ?? "Pokémon";

  const formattedId = `#${String(pokemon.id).padStart(3, "0")}`;
  const heightM = (pokemon.height / 10).toFixed(1);
  const weightKg = (pokemon.weight / 10).toFixed(1);

  const typeDefenseMap: Record<PokemonTypeName, number> = {} as Record<
    PokemonTypeName,
    number
  >;

  const allTypes = Object.keys(TYPE_COLORS) as PokemonTypeName[];
  allTypes.forEach((attackType) => {
    let multiplier = 1;
    types.forEach((defType) => {
      const row = typeEfficacy.find(
        (e) =>
          e.pokemon_v2_type.name === attackType &&
          e.pokemonV2TypeByTargetTypeId.name === defType,
      );
      if (row) multiplier *= row.damage_factor / 100;
    });
    typeDefenseMap[attackType] = multiplier;
  });

  const weakTo = allTypes.filter((t) => typeDefenseMap[t] > 1);
  const resistant = allTypes.filter(
    (t) => typeDefenseMap[t] > 0 && typeDefenseMap[t] < 1,
  );
  const immune = allTypes.filter((t) => typeDefenseMap[t] === 0);

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

      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[400px_1fr]">
          <div className="flex flex-col gap-5">
            <div
              className="relative flex flex-col items-center rounded-3xl p-8 pt-10"
              style={{
                background: `radial-gradient(ellipse at 50% 30%, ${primaryColor}22 0%, #1a1a2e 70%)`,
                border: `1px solid ${primaryColor}30`,
              }}
            >
              {pokemon.id > 1 && (
                <Link
                  href={`/pokemon/${pokemon.id - 1}`}
                  className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-white/5 p-2 text-white/40 transition hover:bg-white/10 hover:text-white"
                  aria-label="Previous Pokémon"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              )}
              <Link
                href={`/pokemon/${pokemon.id + 1}`}
                className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-white/5 p-2 text-white/40 transition hover:bg-white/10 hover:text-white"
                aria-label="Next Pokémon"
              >
                <ArrowLeft className="h-5 w-5 rotate-180" />
              </Link>

              <Image
                src={image}
                alt={pokemon.name}
                width={260}
                height={260}
                priority
                className="drop-shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-transform duration-500 hover:scale-105"
              />
            </div>

            <div className="flex flex-col items-center gap-2 text-center">
              <p className="text-sm font-medium text-white/40">{formattedId}</p>
              <h1 className="text-4xl font-bold capitalize">{pokemon.name}</h1>
              <p className="text-sm text-white/50">{genus}</p>
              <div className="mt-1 flex gap-2">
                {types.map((t) => (
                  <span
                    key={t}
                    className="rounded-full px-4 py-1 text-xs font-bold tracking-widest text-white uppercase"
                    style={{ backgroundColor: TYPE_COLORS[t] }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <button className="flex items-center gap-2 rounded-full bg-yellow-500/20 px-5 py-2 text-sm font-semibold text-yellow-400 transition hover:bg-yellow-500/30">
                <span>♥</span> Add to Team
              </button>
              <button className="flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white/70 transition hover:bg-white/15">
                <span>↗</span> Share
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-2xl bg-[#1a1a2e] p-5">
              {flavorText && (
                <p className="mb-5 text-sm leading-relaxed text-white/70 italic">
                  {flavorText}
                </p>
              )}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <InfoCard label="Height" value={`${heightM} m`} />
                <InfoCard label="Weight" value={`${weightKg} kg`} />
                <InfoCard label="Catch Rate" value={`${catchRatePct}%`} />
                <InfoCard
                  label="Abilities"
                  value={
                    hiddenAbilityLabel
                      ? `${abilityLabel}, ${hiddenAbilityLabel}`
                      : abilityLabel
                  }
                />
              </div>
            </div>

            <div className="rounded-2xl bg-[#1a1a2e] p-5">
              <SectionTitle icon="📊" label="Base Stats" />
              <div className="mt-4 flex flex-col gap-3">
                {pokemon.pokemon_v2_pokemonstats.map((s) => (
                  <StatBar
                    key={s.pokemon_v2_stat.name}
                    label={
                      STAT_LABEL[s.pokemon_v2_stat.name] ??
                      s.pokemon_v2_stat.name.toUpperCase()
                    }
                    value={s.base_stat}
                    max={STAT_MAX[s.pokemon_v2_stat.name] ?? 300}
                    color={primaryColor}
                  />
                ))}
              </div>
            </div>

            {specyData?.pokemon_v2_evolutionchain && (
              <div className="rounded-2xl bg-[#1a1a2e] p-5">
                <SectionTitle icon="🔗" label="Evolution Chain" />
                <div className="mt-4">
                  <EvolutionChain
                    species={
                      specyData.pokemon_v2_evolutionchain
                        .pokemon_v2_pokemonspecies
                    }
                    currentId={pokemon.id}
                  />
                </div>
              </div>
            )}

            <div className="rounded-2xl bg-[#1a1a2e] p-5">
              <SectionTitle icon="🛡" label="Type Defenses" />
              <div className="mt-4">
                <TypeDefenses
                  weakTo={weakTo}
                  resistant={resistant}
                  immune={immune}
                  typeDefenseMap={typeDefenseMap}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl bg-white/5 p-3">
      <span className="text-[10px] font-medium tracking-widest text-white/40 uppercase">
        {label}
      </span>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  );
}

function SectionTitle({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-base">{icon}</span>
      <h2 className="text-base font-bold text-white">{label}</h2>
    </div>
  );
}
