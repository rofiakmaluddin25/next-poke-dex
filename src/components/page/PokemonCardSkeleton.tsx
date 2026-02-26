export default function PokemonCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-[#1a1a2e] p-3">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-[#13132b]">
        <span className="absolute top-2 right-2 h-3 w-8 animate-pulse rounded bg-white/10" />
        <div className="absolute inset-0 m-4 animate-pulse rounded-lg bg-white/5" />
      </div>

      <div className="flex flex-col gap-2 px-0.5">
        <div className="h-3.5 w-3/4 animate-pulse rounded bg-white/10" />
        <div className="flex gap-1.5">
          <div className="h-4 w-12 animate-pulse rounded bg-white/10" />
          <div className="h-4 w-10 animate-pulse rounded bg-white/10" />
        </div>
      </div>
    </div>
  );
}
