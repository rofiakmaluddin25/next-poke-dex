import type { PokemonTypeName } from "@/types/pokemon";
import { TYPE_COLORS } from "./PokemonDetailView";

interface Props {
  weakTo: PokemonTypeName[];
  resistant: PokemonTypeName[];
  immune: PokemonTypeName[];
  typeDefenseMap: Record<PokemonTypeName, number>;
}

function TypeChip({
  type,
  multiplier,
}: {
  type: PokemonTypeName;
  multiplier?: number;
}) {
  const formatMultiplier = (m: number) => {
    if (m === 0) return "0×";
    if (m === 0.25) return "¼×";
    if (m === 0.5) return "½×";
    if (m === 2) return "2×";
    if (m === 4) return "4×";
    return `${m}×`;
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <span
        className="rounded px-2 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase shadow-sm"
        style={{ backgroundColor: TYPE_COLORS[type] }}
      >
        {type}
      </span>
      {multiplier !== undefined && multiplier !== 1 && (
        <span className="text-[10px] font-bold text-white/50">
          {formatMultiplier(multiplier)}
        </span>
      )}
    </div>
  );
}

export default function TypeDefenses({
  weakTo,
  resistant,
  immune,
  typeDefenseMap,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="rounded-xl bg-white/5 p-4">
        <p className="mb-3 text-xs font-semibold tracking-widest text-white/40 uppercase">
          Weak To
        </p>
        <div className="flex flex-wrap gap-2">
          {weakTo.length > 0 ? (
            weakTo.map((t) => (
              <TypeChip key={t} type={t} multiplier={typeDefenseMap[t]} />
            ))
          ) : (
            <span className="text-xs text-white/30">None</span>
          )}
        </div>
      </div>

      <div className="rounded-xl bg-white/5 p-4">
        <p className="mb-3 text-xs font-semibold tracking-widest text-white/40 uppercase">
          Resistant
        </p>
        <div className="flex flex-wrap gap-2">
          {resistant.length > 0 ? (
            resistant.map((t) => (
              <TypeChip key={t} type={t} multiplier={typeDefenseMap[t]} />
            ))
          ) : (
            <span className="text-xs text-white/30">None</span>
          )}
        </div>
      </div>

      <div className="rounded-xl bg-white/5 p-4">
        <p className="mb-3 text-xs font-semibold tracking-widest text-white/40 uppercase">
          Immune
        </p>
        <div className="flex flex-wrap gap-2">
          {immune.length > 0 ? (
            immune.map((t) => <TypeChip key={t} type={t} />)
          ) : (
            <span className="text-xs text-white/30">None</span>
          )}
        </div>
      </div>
    </div>
  );
}
