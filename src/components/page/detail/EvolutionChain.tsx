import Image from "next/image";
import Link from "next/link";
import type { GqlEvolutionSpecies } from "@/types/pokemon";

interface Props {
  species: GqlEvolutionSpecies[];
  currentId: number;
}

export default function EvolutionChain({ species, currentId }: Props) {
  if (!species || species.length === 0) return null;

  const getSprite = (id: number) =>
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

  const formatId = (id: number) => `#${String(id).padStart(3, "0")}`;

  return (
    <div className="flex flex-wrap items-center justify-start gap-2">
      {species.map((s, idx) => {
        const evolution = s.pokemon_v2_pokemonevolutions[0];
        const isCurrent = s.id === currentId;

        return (
          <div key={s.id} className="flex items-center gap-2">
            {idx > 0 && (
              <div className="flex flex-col items-center text-white/40">
                <span className="text-[10px] font-medium">
                  {evolution?.min_level ? `Lvl ${evolution.min_level}` : "→"}
                </span>
                <span className="text-lg leading-none">→</span>
              </div>
            )}

            <Link
              href={`/pokemon/${s.id}`}
              className={`flex flex-col items-center gap-1 rounded-2xl p-2 transition-all ${
                isCurrent
                  ? "bg-orange-500/20 ring-2 ring-orange-400"
                  : "hover:bg-white/5"
              }`}
            >
              <div className="relative h-16 w-16">
                <Image
                  src={getSprite(s.id)}
                  alt={s.name}
                  fill
                  sizes="64px"
                  className="object-contain drop-shadow-md"
                />
              </div>
              <span className="text-[10px] text-white/40">
                {formatId(s.id)}
              </span>
              <span
                className={`text-xs font-semibold capitalize ${
                  isCurrent ? "text-orange-400" : "text-white/80"
                }`}
              >
                {s.name}
              </span>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
