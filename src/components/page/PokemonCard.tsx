import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { PokemonCardData, PokemonTypeName } from "@/types/pokemon";

const TYPE_STYLES: Record<PokemonTypeName, string> = {
  normal: "bg-[#6d6d4e] text-[#d1d1b0]",
  fire: "bg-[#9c3d0a] text-[#f5a26b]",
  water: "bg-[#0a4a7c] text-[#6bbcf5]",
  electric: "bg-[#7c6b00] text-[#f5d800]",
  grass: "bg-[#1a5c2a] text-[#6bcf8a]",
  ice: "bg-[#0a5c6b] text-[#a0e8f0]",
  fighting: "bg-[#7c1a1a] text-[#f5a0a0]",
  poison: "bg-[#5c1a7c] text-[#d08cf5]",
  ground: "bg-[#7c5c1a] text-[#f5d08c]",
  flying: "bg-[#3a1a7c] text-[#b08cf5]",
  psychic: "bg-[#7c1a4a] text-[#f58cba]",
  bug: "bg-[#3a5c00] text-[#b0d400]",
  rock: "bg-[#5c4d1a] text-[#c8b878]",
  ghost: "bg-[#2a1a5c] text-[#9080c8]",
  dragon: "bg-[#1a1a7c] text-[#8080f8]",
  dark: "bg-[#2a1a0a] text-[#908060]",
  steel: "bg-[#3d3d4e] text-[#bdbdd0]",
  fairy: "bg-[#5c1a3d] text-[#f5a0d0]",
};

function TypeBadge({ type }: { type: PokemonTypeName }) {
  return (
    <span
      className={cn(
        "rounded px-2 py-0.5 text-[10px] font-semibold tracking-widest uppercase",
        TYPE_STYLES[type],
      )}
    >
      {type}
    </span>
  );
}

import { Check } from "lucide-react";

interface PokemonCardProps extends PokemonCardData {
  href?: string;
  selectable?: boolean;
  selected?: boolean;
  onToggle?: () => void;
}

export default function PokemonCard({
  id,
  name,
  image,
  types,
  href,
  selectable,
  selected,
  onToggle,
}: PokemonCardProps) {
  const formattedId = `#${String(id).padStart(3, "0")}`;

  const card = (
    <div
      className={cn(
        "group relative flex flex-col gap-3 rounded-2xl bg-[#1a1a2e] p-3 transition-all duration-300 hover:shadow-xl hover:shadow-black/40",
        selectable &&
          "cursor-pointer hover:-translate-y-1 hover:ring-2 hover:ring-blue-500/50",
        selected
          ? "bg-blue-900/10 shadow-[0_0_20px_rgba(59,130,246,0.3)] ring-2 ring-blue-500"
          : !selectable && "hover:-translate-y-1",
      )}
    >
      {selectable && (
        <div
          className={cn(
            "absolute top-3 left-3 z-20 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors",
            selected
              ? "border-blue-500 bg-blue-500 text-white"
              : "border-white/20 bg-black/40 text-transparent group-hover:border-white/40",
          )}
        >
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        </div>
      )}

      <div className="relative aspect-square overflow-hidden rounded-xl bg-[#13132b]">
        <span className="absolute top-2 right-2 z-10 text-[11px] font-medium text-white/50 select-none">
          {formattedId}
        </span>
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className={cn(
            "object-contain p-2 drop-shadow-lg transition-transform duration-300 group-hover:scale-105",
            selectable && !selected && "opacity-80 grayscale-[20%]",
            selected && "scale-105",
          )}
        />
      </div>

      <div className="flex flex-col gap-1.5 px-0.5">
        <h3 className="text-sm font-bold text-white capitalize">{name}</h3>
        <div className="flex flex-wrap gap-1.5">
          {types.map((type) => (
            <TypeBadge key={type} type={type} />
          ))}
        </div>
      </div>
    </div>
  );

  if (selectable) {
    return (
      <button
        onClick={onToggle}
        className="block w-full rounded-2xl text-left outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        {card}
      </button>
    );
  }

  if (href) {
    return (
      <Link
        href={href}
        className="block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        {card}
      </Link>
    );
  }

  return card;
}
